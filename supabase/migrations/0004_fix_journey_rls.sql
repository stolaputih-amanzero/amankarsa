-- 0004_fix_journey_rls.sql
-- AMANKARSA RLS FIX FOR JOURNEY, PULSE, AND IMPACT PERSISTENCE
-- Allows Server Actions and Community Initiators to persist journeys and pulses.

-- 1. Journey Table: Allow creation and management
DROP POLICY IF EXISTS "Initiators manage own journeys" ON journey;
CREATE POLICY "Initiators manage own journeys" ON journey
    FOR ALL
    USING (initiator_id IS NULL OR auth.uid() = initiator_id)
    WITH CHECK (initiator_id IS NULL OR auth.uid() = initiator_id);

DROP POLICY IF EXISTS "Anyone can read active journeys" ON journey;
CREATE POLICY "Anyone can read active journeys" ON journey
    FOR SELECT
    USING (true);

-- 2. The Pulse Table: Add INSERT / ALL policy (previously only SELECT existed)
DROP POLICY IF EXISTS "Anyone can read pulses" ON the_pulse;
DROP POLICY IF EXISTS "Manage pulses" ON the_pulse;
CREATE POLICY "Manage pulses" ON the_pulse
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 3. Beneficiary Group: Allow management when initiator_id is NULL or matches
DROP POLICY IF EXISTS "Initiators manage own beneficiary groups" ON beneficiary_group;
CREATE POLICY "Initiators manage own beneficiary groups" ON beneficiary_group
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM journey 
            WHERE journey.id = beneficiary_group.journey_id 
              AND (journey.initiator_id IS NULL OR journey.initiator_id = auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM journey 
            WHERE journey.id = beneficiary_group.journey_id 
              AND (journey.initiator_id IS NULL OR journey.initiator_id = auth.uid())
        )
    );

-- 4. Impact Record: Allow management when initiator_id is NULL or matches
DROP POLICY IF EXISTS "Initiators manage own impact records" ON impact_record;
CREATE POLICY "Initiators manage own impact records" ON impact_record
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM journey 
            WHERE journey.id = impact_record.journey_id 
              AND (journey.initiator_id IS NULL OR journey.initiator_id = auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM journey 
            WHERE journey.id = impact_record.journey_id 
              AND (journey.initiator_id IS NULL OR journey.initiator_id = auth.uid())
        )
    );
