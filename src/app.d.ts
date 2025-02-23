import { ValidationResult, BlobRef } from '@atproto/lexicon'

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
			headerImage?: string;
			backgroundColor: string;
		};

		// Generated Code From Lexicon
		export interface Record {
			hunterName: string
			hunterID: string
			hunterRank: string
			selectedPlatforms: string[]
			selectedWeapons: Weapon
			playTimeRange: number[]
			comment: string
			headerImage?: BlobRef
			backgroundColor: string
			createdAt: string
			[k: string]: unknown
		}

		export interface Weapon {
			gs?: number
			ls?: number
			sns?: number
			db?: number
			hammer?: number
			hh?: number
			lance?: number
			gl?: number
			sa?: number
			cb?: number
			ig?: number
			lbg?: number
			hbg?: number
			bow?: number
			[k: string]: unknown
		}
	}
}

export {};
