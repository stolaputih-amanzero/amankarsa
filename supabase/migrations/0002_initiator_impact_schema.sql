-- 0002_initiator_impact_schema.sql
-- AMANKARSA INITIATOR & IMPACT SCHEMA (Phase 1 / Pillar 1)
-- Status: Constitutional Compliant (Grace-based, No Conversion Score, No Surveillance)

-- 1. Beneficiary Group (Penerima Manfaat)
CREATE TABLE IF NOT EXISTS beneficiary_group (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journey(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    category TEXT CHECK (category IN ('lansia', 'anak', 'keluarga', 'penyandang_disabilitas', 'komunitas_lokal', 'lingkungan_hidup', 'pekerja_rentan', 'lainnya')),
    estimated_count INTEGER,
    unit TEXT CHECK (unit IN ('orang', 'keluarga', 'paket', 'kunjungan', 'jam_pelayanan', 'area_layanan')),
    privacy_level TEXT DEFAULT 'aggregate_only',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE beneficiary_group ENABLE ROW LEVEL SECURITY;

-- CONSTITUTIONAL GUARD: Initiator hanya bisa mengelola kelompok milik Journey yang mereka buat
CREATE POLICY "Initiators manage own beneficiary groups"
ON beneficiary_group FOR ALL
USING (
    EXISTS (SELECT 1 FROM journey WHERE journey.id = beneficiary_group.journey_id AND journey.initiator_id = auth.uid())
)
WITH CHECK (
    EXISTS (SELECT 1 FROM journey WHERE journey.id = beneficiary_group.journey_id AND journey.initiator_id = auth.uid())
);

-- 2. Impact Record (Buah Kasih Nyata)
CREATE TABLE IF NOT EXISTS impact_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journey(id) ON DELETE CASCADE,
    beneficiary_group_id UUID REFERENCES beneficiary_group(id) ON DELETE SET NULL,
    service_activity_name TEXT NOT NULL,
    metric_type TEXT CHECK (metric_type IN ('volunteer_hours', 'meals_distributed', 'visits_made', 'packages_distributed', 'families_served', 'environmental_actions', 'other_service_actions')),
    quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    story_description TEXT,
    source TEXT CHECK (source IN ('observable', 'self_reported', 'facilitator_reported', 'initiator_reported')) DEFAULT 'initiator_reported',
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE impact_record ENABLE ROW LEVEL SECURITY;

-- CONSTITUTIONAL GUARD: Tidak ada metrik konversi rohani, hanya dampak fisik/sosial
CREATE POLICY "Initiators manage own impact records"
ON impact_record FOR ALL
USING (
    EXISTS (SELECT 1 FROM journey WHERE journey.id = impact_record.journey_id AND journey.initiator_id = auth.uid())
)
WITH CHECK (
    EXISTS (SELECT 1 FROM journey WHERE journey.id = impact_record.journey_id AND journey.initiator_id = auth.uid())
);

CREATE POLICY "Participants read active impact records"
ON impact_record FOR SELECT
USING (
    EXISTS (SELECT 1 FROM journey WHERE journey.id = impact_record.journey_id AND journey.status = 'active')
);
