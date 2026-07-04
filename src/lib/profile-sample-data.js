import sampleProfiles from "@/data/sample-profiles.json";

/** @param {string} profileId */
export function getSampleProfileById(profileId) {
  if (!profileId) return null;
  const profile = sampleProfiles[profileId];
  return profile ? { ...profile } : null;
}

/** @returns {string[]} */
export function getSampleProfileIds() {
  return Object.keys(sampleProfiles);
}
