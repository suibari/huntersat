// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		type ProfileData = {
			hunterName: string;
			hunterID: string;
			hunterRank: string;
			selectedPlatforms: string[];
			selectedWeapons: Record<string, number>;
			playTimeRange: number[];
			comment: string;
			headerImage: string;
			backgroundColor: string;
		};
	}
}

export {};
