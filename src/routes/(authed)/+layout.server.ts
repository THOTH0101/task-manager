import { getUserUnreadNotice } from '$lib/server/notice';
import { getUserById } from '$lib/server/user';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	const user = await getUserById(locals.user?.id as string);
	const notices = await getUserUnreadNotice(locals.user?.id as string);

	return { user, notices };
};
