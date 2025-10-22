import { hashPassword } from '$lib/bcrpyt';
import { addUser, deleteUser, getUserList, isUserExist, updateUser } from '$lib/server/user';
import { fail } from '@sveltejs/kit';
import { object, string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const users = await getUserList(locals.user?.id as string);

	return { team: users };
};

export const actions: Actions = {
	addUser: async ({ request, locals }) => {
		const formData = await request.formData();

		let name = formData.get('name') as string;
		let title = formData.get('title') as string;
		let email = formData.get('email') as string;
		let role = formData.get('role') as string;

		const formSchema = object({
			name: string().required('Name is required'),
			title: string().required('Title is required'),
			email: string().email('Invalid email format').required('Email is required'),
			role: string().required('Role is required')
		});

		try {
			// Validate the form data
			await formSchema.validate({ name, title, email, role }, { abortEarly: false });

			const isUserExists = await isUserExist(email);
			console.log('is User id: ', isUserExists);

			if (isUserExists) {
				console.log('A user with this email already exists');
				return fail(400, { message: 'A user with this email already exists.' });
			}

			const hashedPassword = await hashPassword(email);
			console.log('hashed password: ', hashPassword);

			const result = await addUser(
				{
					name,
					email,
					password: hashedPassword,
					title,
					role,
					isAdmin: false,
					isActive: true
				},
				locals.user?.id
			);

			if (!result) {
				return fail(400, { message: 'Failed to add user.' });
			}

			console.log('User created: ', result);
			return { message: 'New user created successfully.' };
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, { input: { name, title, email, role }, errors: validationError });
			}

			return fail(400, { message: 'Error creating user.' });
		}
	},
	updateUser: async ({ request }) => {
		const formData = await request.formData();

		let name = formData.get('name') as string;
		let title = formData.get('title') as string;
		let email = formData.get('email') as string;
		let role = formData.get('role') as string;

		const formSchema = object({
			name: string().required('Name is required'),
			title: string().required('Title is required'),
			email: string().email('Invalid email format').required('Email is required'),
			role: string().required('Role is required')
		});

		try {
			// Validate the form data
			await formSchema.validate({ name, title, email, role }, { abortEarly: false });

			const result = await updateUser({ name, title, email, role }, email);

			if (!result) {
				return fail(400, { message: 'Unable to update user.' });
			}

			return { message: 'User updated successfully.' };
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, { input: { name, title, email, role }, errors: validationError });
			}

			return fail(400, { message: 'Error updating user.' });
		}
	},
	deleteUser: async ({ request, locals }) => {
		const formData = await request.formData();

		const userId = formData.get('id') as string;

		try {
			const adminId = locals.user?.id;

			if (userId === adminId) {
				return fail(400, { message: "You can't delete your own account." });
			}

			await deleteUser(userId);

			return { success: true };
		} catch (error) {
			console.log('Error deleting user: ', error);
			return fail(400, { message: 'Error deleting user.' });
		}
	},
	activeUser: async ({ request, locals }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const status = formData.get('isActive') as string;

		const isActive = status ? true : false;

		try {
			await updateUser({ isActive }, email);

			return { success: true };
		} catch (error) {
			console.log('Error deleting user: ', error);
			return fail(400, { message: 'Error deleting user.' });
		}
	}
};
