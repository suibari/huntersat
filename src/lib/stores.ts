import { writable } from "svelte/store";

export const myDid = writable<string|null>();
export const isLoading = writable<boolean>(true);
export const profileData = writable<App.ProfileData>();
