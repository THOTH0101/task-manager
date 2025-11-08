import { getUserUnreadNotice } from '$lib/server/notice';
import { getUserById, getUserList } from '$lib/server/user';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Notice, User } from '$lib';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	const user: User = (await getUserById(locals.user?.id as string)) as User;
	const notices: Notice[] = (await getUserUnreadNotice(locals.user?.id as string)) as Notice[];
	const team: User[] = (await getUserList(locals.user?.id as string)) as User[];

	return { user, notices, team };
};
