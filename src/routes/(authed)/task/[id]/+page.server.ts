import { ActivityType, safeStringToEnum, TaskPriority, TaskStage, type Task } from '$lib';
import { addActivity } from '$lib/server/activity';
import { uploadAssets } from '$lib/server/assets';
import { addSubTask, deleteTask, getTaskById, updateSubTask, updateTask } from '$lib/server/task';
import { fail, type Actions } from '@sveltejs/kit';
import { date, object, string } from 'yup';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const task: Task = (await getTaskById(params.id)) as Task;

	return { task };
};

export const actions: Actions = {
	addSubTask: async ({ params, request }) => {
		const formData = await request.formData();

		let title = formData.get('title') as string;
		let tag = formData.get('tag') as string;
		let dueDateString = formData.get('date') as string;

		const formSchema = object({
			title: string().required('Title is required')
		});

		try {
			formSchema.validateSync({ title }, { abortEarly: false });

			let dueDate: Date | undefined = new Date(dueDateString);

			const result = await addSubTask({ title, tag, date: dueDate }, params.id as string);

			if (!result) return fail(400, { message: 'Error! unable to add subtask' });

			return;
		} catch (error: any) {
			const validationError: Record<string, string> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, { input: { title, tag, dueDateString }, errors: validationError });
			}

			console.log('Error adding task: ', error);
			return fail(400, { message: 'Error creating task.' });
		}
	},

	updateSubTask: async ({ request }) => {
		const formData = await request.formData();

		let subTaskId = formData.get('id') as string;
		let status = formData.get('status') as string;

		const isCompleted = status ? true : false;

		try {
			await updateSubTask({ isCompleted }, subTaskId);

			return;
		} catch (error) {
			console.log('Error updating sub-task: ', error);
		}
	},

	updateTask: async ({ request, params }) => {
		const formData = await request.formData();

		let title = formData.get('title') as string;
		let dueDateString = formData.get('date') as string;
		let description = formData.get('description') as string;
		let stageString = formData.get('stage') as string;
		let priorityString = formData.get('priority') as string;
		let assets = formData.getAll('assets') as File[];
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
			let uploadedAssets: string[] | null = [];

			// upload assets to supabase storage and get the urls
			if (assets.length > 0 && assets[0].size !== 0) {
				uploadedAssets = await uploadAssets(assets);

				if (!uploadedAssets)
					return fail(400, {
						message: 'Error uploading assets.',
						input: { title, dueDateString, stageString, priorityString }
					});
			}

			const result = await updateTask(
				{
					title,
					date: dueDate,
					stage,
					priority,
					assets: uploadedAssets ?? [],
					description,
					teamUsers: { connect: users }
				},
				params.id as string
			);

			if (!result) return fail(400, { message: 'Error! unable to update task' });

			return { message: 'Task updated successfully.' };
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, {
					input: { title, dueDateString, stageString, priorityString },
					errors: validationError
				});
			}

			console.log('Error updating task: ', error);
			return fail(400, { message: 'Error updating task.' });
		}
	},

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
	},

	addActivity: async ({ params, locals, request }) => {
		const formData = await request.formData();

		let text = formData.get('text') as string;
		let typeString = formData.get('type') as string;

		try {
			await addActivity(
				{ activity: text, type: typeString as ActivityType },
				locals.user?.id as string,
				params.id as string
			);

			return;
		} catch (error) {
			console.log('Error adding activity: ', error);
			return fail(400, { message: 'Error! unable to add activity.' });
		}
	}
};
