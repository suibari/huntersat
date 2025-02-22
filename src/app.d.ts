// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		type ProfileUpdateEvent = CustomEvent<{
			hunterName: "";
			hunterRank: "-";
			selectedPlatforms: [];
			selectedWeapons: {};
			playTimeRange: [8, 22];
			comment: "";
			headerImage: string;
			backgroundColor: string;
		}>;
	}
}

export {};
