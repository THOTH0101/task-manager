import type { Task, User } from '$lib';
import { getUserTasks } from '$lib/server/task';
import { getUserList } from '$lib/server/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const tasks: Task[] | undefined = await getUserTasks(locals.user?.id as string);
	const users: User[] | undefined = await getUserList(locals.user?.id as string);

	return { tasks, users };
};
