import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { markAllAsRead, markAsRead } from '$lib/server/notice';

export const load: PageServerLoad = () => {
	return {};
};

export const actions: Actions = {
	readNotice: async ({ request, locals }) => {
		const formData = await request.formData();

		const noticeId = formData.get('id') as string;

		await markAsRead(locals.user?.id as string, noticeId);

		return;
	},

	readAllNotice: async ({ locals }) => {
		await markAllAsRead(locals.user?.id as string);

		return;
	}
};
