import { writable } from "svelte/store";

export const myDid = writable<string|null>();
export const isLoading = writable<boolean>(true);
export const profileData = writable<App.ProfileData>({
  hunterName: "",
  hunterID: "",
  hunterRank: "-",
  selectedPlatforms: [],
  selectedWeapons: {},
  playTimeRange: [8, 22],
  comment: "",
  backgroundColor: "",
});
