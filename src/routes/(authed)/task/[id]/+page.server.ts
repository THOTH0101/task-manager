import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteTask, getTaskById, updateTask } from '$lib/server/task';
import {
	ActivityType,
	TaskPriority,
	TaskStage,
	type Activity,
	type SubTask,
	type Task,
	type User
} from '$lib';

export const load: PageServerLoad = async ({ params }) => {
	const taskFromDb = await getTaskById(params.id);

	const priority = (TaskPriority[taskFromDb?.priority ?? 'NORMAL'] as string).toLowerCase();
	const stage = (TaskStage[taskFromDb?.stage ?? 'TODO'] as string).toLowerCase();

	const activities = taskFromDb?.activities.map((activity): Activity => {
		const type = (ActivityType[activity.type] as string).toLowerCase();
		return {
			id: activity.id,
			type,
			date: activity.date,
			by: activity.byUserId,
			activity: activity.activity ?? ''
		};
	});

	const task: Task = {
		id: taskFromDb?.id as string,
		title: taskFromDb?.title as string,
		date: taskFromDb?.date as Date,
		assets: taskFromDb?.assets,
		isTrashed: taskFromDb?.isTrashed,
		activities,
		subTasks: taskFromDb?.subTasks as SubTask[],
		team: taskFromDb?.teamUsers as User[],
		priority,
		stage
	};

	return { task };
};

export const actions: Actions = {
	trashTask: async ({ params }) => {
		const result = await updateTask({ isTrashed: true }, params.id as string);

		if (!result) return fail(400, { message: 'Error! unable to trash task.' });

		return { message: 'Task trashed sucessfully.' };
	},

	restoreTask: async ({ params }) => {
		console.log('params:', params.id);
		const result = await updateTask({ isTrashed: false }, params.id as string);

		if (!result) return fail(400, { message: 'Error! unable to restore task.' });

		return { message: 'Task restore successfully.' };
	},

	deleteTask: async ({ params }) => {
		const result = await deleteTask(params.id as string);

		if (!result) return fail(400, { message: 'Error! unable to delete task.' });

		return { message: 'Task deleted successfully.' };
	}
};
