import { lucia } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	redirect(303, '/');
};

export const actions = {
	default: async ({ cookies }) => {
		cookies.set(lucia.sessionCookieName, '', {
			path: '/',
			expires: new Date(0)
		});

		console.log('Logout successfully');

		return { success: true };
	}
};
