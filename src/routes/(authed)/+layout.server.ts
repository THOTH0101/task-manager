import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { getUserById } from '$lib/server/user';

type User = {
	id: string;
	email: string;
	name: string;
	title: string;
	role: string;
	isAdmin: boolean;
	isActive: boolean;
};

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	const userFromDb = await getUserById(locals.user?.id as string);

	const user: User = {
		id: userFromDb?.id as string,
		email: userFromDb?.email as string,
		name: userFromDb?.name as string,
		title: userFromDb?.title as string,
		role: userFromDb?.role as string,
		isAdmin: userFromDb?.isAdmin as boolean,
		isActive: userFromDb?.isActive as boolean
	};

	return { user };
};
