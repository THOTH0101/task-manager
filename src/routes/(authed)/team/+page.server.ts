import { hashPassword } from '$lib/bcrpyt';
import { addUser, deleteUser, getUserList, isUserExist, updateUser } from '$lib/server/user';
import { fail } from '@sveltejs/kit';
import { object, ref, string } from 'yup';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const team = await getUserList(locals.user?.id as string);

	return { team };
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

			if (isUserExists) {
				return fail(400, { message: 'A user with this email already exists.' });
			}

			const hashedPassword = await hashPassword(email);

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
				return fail(400, { message: 'Error! unable to create user.' });
			}

			return { message: 'New user created successfully.' };
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, { input: { name, title, email, role }, errors: validationError });
			}

			console.log('Error adding user: ', error);
			return fail(400, { message: 'Error! unable to create user.' });
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
				return fail(400, { message: 'Error! unable to update user.' });
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

			console.log('Error updating user: ', error);
			return fail(400, { message: 'Error! unable to update user.' });
		}
	},
	deleteUser: async ({ request, locals }) => {
		const formData = await request.formData();

		const userId = formData.get('id') as string;

		try {
			const adminId = locals.user?.id;

			if (userId === adminId) {
				return fail(400, { message: "Error! you can't delete your own account." });
			}

			await deleteUser(userId);

			return { success: true };
		} catch (error) {
			console.log('Error deleting user: ', error);
			return fail(400, { message: 'Error! unable to delete user.' });
		}
	},
	activeUser: async ({ request }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const status = formData.get('isActive') as string;

		const isActive = status ? true : false;

		try {
			await updateUser({ isActive }, email);

			let message;

			message = isActive ? 'User activated successfully.' : 'User deactivated successfully.';
			return { message };
		} catch (error) {
			console.log('Error deleting user: ', error);
			return fail(400, { message: 'Error! unable to activate or deactivate user.' });
		}
	},
	changePassword: async ({ request }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		const formSchema = object({
			password: string()
				.required('Password is required')
				.min(8, 'Password must be at least 8 characters'),
			confirmPassword: string()
				.oneOf([ref('password')], 'Passwords must match')
				.required('Confirm password is required')
		});

		try {
			// Validate the form data
			await formSchema.validate({ password, confirmPassword }, { abortEarly: false });

			const hashedPassword = await hashPassword(password);

			const result = await updateUser({ password: hashedPassword }, email);

			if (!result) {
				return fail(400, { message: 'Error! unable to change user password.' });
			}

			return { success: true };
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});

				return fail(400, { errors: validationError });
			}

			console.log('Error changing user password: ', error);
			return fail(400, { message: 'Error! unable to change user password.' });
		}
	}
};
