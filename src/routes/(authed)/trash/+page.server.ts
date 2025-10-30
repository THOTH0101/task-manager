import { TaskPriority, TaskStage, type Task } from '$lib';
import { getTrashTasks } from '$lib/server/task';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = await getTrashTasks(locals.user?.id as string);

	const tasks: Task[] =
		result?.map((task): Task => {
			const priority = (TaskPriority[task.priority] as string).toLowerCase();
			const stage = (TaskStage[task.stage] as string).toLowerCase();

			return {
				id: task.id,
				title: task.title,
				date: task.date,
				isTrashed: task.isTrashed,
				priority,
				stage
			};
		}) ?? [];

	return { tasks };
};
