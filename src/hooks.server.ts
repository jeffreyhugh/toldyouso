import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			const { data } = await event.locals.supabase.auth.signInAnonymously();
			return { session: data.session, user: data.user };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			const { data } = await event.locals.supabase.auth.signInAnonymously();
			return { session: data.session, user: data.user };
		}

		// @ts-expect-error reassigned later
		delete session.user;

		return { session: Object.assign({}, session, { user }), user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(303, '/private');
	}

	return resolve(event);
};

const trends: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/trends') {
		const targetURL = 'https://trends.jh.ms/script.js';

		const response = await fetch(targetURL, {
			method: event.request.method,
			headers: {
				...Object.fromEntries(event.request.headers)
			},
			body: event.request.method === 'POST' ? await event.request.text() : null
		});

		const responseBody = await response.text();
		return new Response(responseBody, {
			status: response.status,
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'application/javascript'
			}
		});
	} else if (event.url.pathname === '/api/send') {
		const targetURL = 'https://trends.jh.ms/api/send';

		const response = await fetch(targetURL, {
			method: event.request.method,
			headers: {
				...Object.fromEntries(event.request.headers)
			},
			body: event.request.method === 'POST' ? await event.request.text() : null
		});

		const responseBody = await response.text();
		return new Response(responseBody, {
			status: response.status,
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'application/javascript'
			}
		});
	}

	return resolve(event);
};

export const handle: Handle = sequence(trends, supabase, authGuard);
