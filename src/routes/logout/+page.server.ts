import { lucia } from '$lib/server/auth.js';
import { redirect, type Actions } from '@sveltejs/kit';

export const load = async () => {
	redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.set(lucia.sessionCookieName, '', {
			path: '/',
			expires: new Date(0)
		});

		return { success: true };
	}
};
