import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PB_BASE_URL: {
		public: true
	},
	DEV_EMAIL: {
		public: true
	},
	DEV_PASSWORD: {
		public: true
	}
});
