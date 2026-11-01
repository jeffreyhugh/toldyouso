import { defineEnvVars } from '@sveltejs/kit/env';

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
	PUBLIC_SUPABASE_ANON_KEY: { public: true, static: true },
	PUBLIC_SUPABASE_URL: { public: true, static: true },
	SUPABASE_URL: { schema: (input) => input ?? '' },
	SUPABASE_KEY: { schema: (input) => input ?? '' }
});
