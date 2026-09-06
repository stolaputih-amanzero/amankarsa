-- 0001_initial_schema.sql
-- AMANKARSA INITIAL SCHEMA (Phase 1)
-- Status: Constitutional Compliant (Grace-based)

-- ==========================================
-- 1. TABLES & CONSTRAINTS
-- ==========================================

CREATE TABLE IF NOT EXISTS participant (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    auth_channel TEXT CHECK (auth_channel IN ('email', 'whatsapp', 'copy')),
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiator_id UUID REFERENCES auth.users(id),
    theme TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    status TEXT CHECK (status IN ('draft', 'active', 'completed')) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participant_journey_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participant(id) ON DELETE CASCADE,
    journey_id UUID REFERENCES journey(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    continuation_intent TEXT CHECK (continuation_intent IN ('none', 'self_guided', 'community_invited', 'next_journey')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- CONSTITUTIONAL GUARD: No failure terminology
    CONSTRAINT chk_grace_states CHECK (state IN ('invited', 'active', 'paused', 'resting', 'completed', 'continuing', 'archived'))
);

CREATE TABLE IF NOT EXISTS the_pulse (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID REFERENCES journey(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL,
    prompt_text TEXT NOT NULL,
    action_type TEXT CHECK (action_type IN ('contemplation', 'practical_action', 'reflection'))
);

CREATE TABLE IF NOT EXISTS pulse_interaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_id UUID REFERENCES the_pulse(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participant(id) ON DELETE CASCADE,
    interacted_at TIMESTAMPTZ DEFAULT NOW(),
    state TEXT NOT NULL,
    -- CONSTITUTIONAL GUARD: No failure or missed terminology
    CONSTRAINT chk_pulse_states CHECK (state IN ('paused', 'acted', 'rested'))
);

CREATE TABLE IF NOT EXISTS bilik_doa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participant(id) ON DELETE CASCADE,
    pulse_interaction_id UUID REFERENCES pulse_interaction(id) ON DELETE SET NULL,
    encrypted_payload TEXT NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tanda_rasa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participant(id) ON DELETE CASCADE,
    journey_id UUID REFERENCES journey(id) ON DELETE CASCADE,
    tag TEXT CHECK (tag IN ('damai', 'bersyukur', 'tergerak', 'lelah', 'cemas', 'sedih', 'bingung')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pohon_karsa_state (
    participant_id UUID PRIMARY KEY REFERENCES participant(id) ON DELETE CASCADE,
    cumulative_actions INTEGER DEFAULT 0,
    current_season_state TEXT NOT NULL DEFAULT 'sprouting',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- CONSTITUTIONAL GUARD: No withered or dead states
    CONSTRAINT chk_pohon_states CHECK (current_season_state IN ('sprouting', 'growing', 'resting', 'bearing_fruit'))
);

CREATE TABLE IF NOT EXISTS recovery_key (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participant(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    channel TEXT CHECK (channel IN ('email','whatsapp','copy')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

-- ==========================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_journey_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE the_pulse ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_interaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE bilik_doa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanda_rasa ENABLE ROW LEVEL SECURITY;
ALTER TABLE pohon_karsa_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_key ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 3. RLS POLICIES (SERVER-ENFORCED GRACE)
-- ==========================================

-- Participant
CREATE POLICY "Users can manage their own participant record" ON participant
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Journey
CREATE POLICY "Anyone can read active journeys" ON journey
    FOR SELECT USING (status = 'active' OR auth.uid() = initiator_id);

CREATE POLICY "Initiators manage own journeys" ON journey
    FOR ALL USING (auth.uid() = initiator_id) WITH CHECK (auth.uid() = initiator_id);

-- Participant Journey State
CREATE POLICY "Users manage own journey state" ON participant_journey_state
    FOR ALL USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);

-- The Pulse
CREATE POLICY "Anyone can read pulses" ON the_pulse
    FOR SELECT USING (true);

-- Pulse Interaction
CREATE POLICY "Users manage own pulse interactions" ON pulse_interaction
    FOR ALL USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);

-- Bilik Doa (CONSTITUTIONAL GUARD N03: Strictly Private)
CREATE POLICY "Bilik Doa is strictly private to owner" ON bilik_doa
    FOR ALL USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);

-- Tanda Rasa
CREATE POLICY "Users manage own Tanda Rasa" ON tanda_rasa
    FOR ALL USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);

-- Pohon Karsa State
CREATE POLICY "Users manage own Pohon Karsa" ON pohon_karsa_state
    FOR ALL USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);


-- ==========================================
-- 4. SECURITY DEFINER FUNCTIONS (Ethical Aggegation)
-- ==========================================

-- Pastoral Signals Function (CONSTITUTIONAL GUARD: Ethical Pulse Reading)
-- Aggregates Tanda Rasa data ONLY if respondent count >= 5
CREATE OR REPLACE FUNCTION public.get_pastoral_signals(p_journey_id UUID)
RETURNS TABLE (tag TEXT, count BIGINT, percentage NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_responses BIGINT;
    is_allowed BOOLEAN;
BEGIN
    -- Authorization check: Caller must be the initiator of the journey
    SELECT EXISTS (
        SELECT 1
        FROM journey j
        WHERE j.id = p_journey_id
        AND j.initiator_id = auth.uid()
    ) INTO is_allowed;

    IF NOT is_allowed THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    -- Count total responses
    SELECT COUNT(*) INTO total_responses
    FROM tanda_rasa
    WHERE journey_id = p_journey_id;

    -- If threshold met, return aggregated stats
    IF total_responses >= 5 THEN
        RETURN QUERY
        SELECT
            tr.tag,
            COUNT(*)::BIGINT,
            ROUND((COUNT(*)::NUMERIC / total_responses::NUMERIC) * 100, 2)
        FROM tanda_rasa tr
        WHERE tr.journey_id = p_journey_id
        GROUP BY tr.tag
        ORDER BY count DESC;
    ELSE
        -- Return empty/insufficient_data flag safely
        RETURN QUERY SELECT 'insufficient_data'::TEXT, 0::BIGINT, 0::NUMERIC;
    END IF;
END;
$$;

-- Secure the function so it isn't executable by anonymous users
REVOKE ALL ON FUNCTION public.get_pastoral_signals(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_pastoral_signals(UUID) TO authenticated;
