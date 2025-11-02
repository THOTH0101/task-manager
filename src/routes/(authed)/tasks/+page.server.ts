import {
	ActivityType,
	safeStringToEnum,
	TaskPriority,
	TaskStage,
	type Activity,
	type Task
} from '$lib';
import { addTask, deleteAllTasks, getUserTasks, updateAllTasks } from '$lib/server/task';
import { fail, type Actions } from '@sveltejs/kit';
import { date, object, string } from 'yup';
import type { PageServerLoad } from './$types';
import { addNotice } from '$lib/server/notice';
import { addActivity } from '$lib/server/activity';

export const load: PageServerLoad = async ({ locals }) => {
	const tasks: Task[] = (await getUserTasks(locals?.user?.id as string)) as Task[];

	return { tasks };
};

export const actions: Actions = {
	addTask: async ({ request, locals }) => {
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

			//alert users of the task
			let text = 'New task has been assigned to you';
			if (users?.length > 1) {
				text = text + ` and ${users?.length - 1} others.`;
			}

			text =
				text +
				` The task priority is set a ${priorityString} priority, so check and act accordingly. The task date is ${dueDate.toDateString()}. Thank you!!!`;

			const activity: Activity = {
				type: 'assigned',
				activity: text
			};

			// create new task
			const result = await addTask({ title, date: dueDate, stage, priority, users });

			if (!result) {
				return fail(400, { message: 'Failed to create task.' });
			}

			// create notification for the created task
			await addNotice({ text, users }, result.id);

			// create assigned activity for newly created task
			await addActivity(
				{ activity: text, type: ActivityType['ASSIGNED'] },
				locals.user?.id as string,
				result.id
			);

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
