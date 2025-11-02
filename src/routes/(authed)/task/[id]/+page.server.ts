import { addSubTask, deleteTask, getTaskById, updateTask } from '$lib/server/task';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Task } from '$lib';
import { object, string } from 'yup';

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
