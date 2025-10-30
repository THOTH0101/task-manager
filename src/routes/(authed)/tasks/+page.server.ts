import {
	ActivityType,
	safeStringToEnum,
	TaskPriority,
	TaskStage,
	type Activity,
	type SubTask,
	type Task,
	type User
} from '$lib';
import {
	addTask,
	deleteAllTasks,
	getUserTasks,
	updateAllTasks,
	updateTask
} from '$lib/server/task';
import { fail, type Actions } from '@sveltejs/kit';
import { date, object, string } from 'yup';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = await getUserTasks(locals?.user?.id as string);

	const tasks: Task[] =
		result?.map((task): Task => {
			const priority = (TaskPriority[task.priority] as string).toLowerCase();
			const stage = (TaskStage[task.stage] as string).toLowerCase();

			const activities = task.activities.map((activity): Activity => {
				const type = (ActivityType[activity.type] as string).toLowerCase();
				return {
					id: activity.id,
					type,
					date: activity.date,
					by: activity.byUserId,
					activity: activity.activity ?? ''
				};
			});

			return {
				id: task.id,
				title: task.title,
				date: task.date,
				assets: task.assets,
				isTrashed: task.isTrashed,
				activities,
				subTasks: task.subTasks as SubTask[],
				team: task.teamUsers as User[],
				priority,
				stage
			};
		}) ?? [];

	return { tasks };
};

export const actions: Actions = {
	addTask: async ({ request }) => {
		const formData = await request.formData();

		let title = formData.get('title') as string;
		let dueDateString = formData.get('date') as string;
		let stageString = formData.get('stage') as string;
		let priorityString = formData.get('priority') as string;
		let usersJsonString = formData.getAll('users') as string[];

		stageString = stageString === 'IN PROGRESS' ? 'IN_PROGRESS' : stageString;

		const formSchema = object({
			title: string().required('Title is required'),
			dueDateString: date().required('Date is required')
		});

		try {
			await formSchema.validate({ title, dueDateString }, { abortEarly: false });

			const priority = safeStringToEnum(TaskPriority, priorityString, TaskPriority.NORMAL);

			const stage = safeStringToEnum(TaskStage, stageString, TaskStage.TODO);

			const users = usersJsonString.map((user) => {
				const u = JSON.parse(user);
				return { id: u.id as string };
			});

			let dueDate: Date | undefined = new Date(dueDateString);

			const result = await addTask({ title, date: dueDate, stage, priority, users });

			if (!result) {
				return fail(400, { message: 'Failed to create task.' });
			}

			return { message: 'New task created successfully.' };
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, { input: { title, dueDateString }, errors: validationError });
			}

			console.log('Error adding task: ', error);
			return fail(400, { message: 'Error creating task.' });
		}
	},
	restoreTasks: async ({ locals }) => {
		const result = await updateAllTasks({ isTrashed: false }, locals.user?.id as string);

		if (!result) return fail(400, { message: 'Error! restoring all tasks.' });

		return { message: 'All tasks restored successfully.' };
	},
	deleteTasks: async ({ locals }) => {
		const result = await deleteAllTasks(locals.user?.id as string);

		if (!result) return fail(400, { message: 'Error! deleting all trashed tasks.' });

		return { message: 'All trashed tasks deleted successfully.' };
	}
};
