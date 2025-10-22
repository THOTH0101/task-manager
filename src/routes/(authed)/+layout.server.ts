import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { getUserById } from '$lib/server/user';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	const user = await getUserById(locals.user?.id as string);

	return { user };
};
