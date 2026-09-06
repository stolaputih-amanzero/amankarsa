// Safety Net: Feature Flags for Pilot
// Mengizinkan tim menonaktifkan fitur yang bermasalah secara instan tanpa redeploy.

export const features = {
  // Jika ada bug kritis pada fitur, ubah env menjadi 'false' untuk menyembunyikannya
  enableSaku: process.env.NEXT_PUBLIC_FEATURE_SAKU !== "false",
  enableBilikDoa: process.env.NEXT_PUBLIC_FEATURE_BILIK_DOA !== "false",
  enablePohonKarsa: process.env.NEXT_PUBLIC_FEATURE_POHON_KARSA !== "false",
  enableInitiatorImpact: process.env.NEXT_PUBLIC_FEATURE_IMPACT !== "false",
};

export type FeatureFlag = keyof typeof features;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
