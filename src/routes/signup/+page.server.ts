import { hashPassword } from '$lib/bcrpyt.js';
import { fail, redirect } from '@sveltejs/kit';
import { object, ref, string } from 'yup';
import type { PageServerLoad } from './$types.js';
import { addUser, isUserExist } from '$lib/server/user.js';

export const load: PageServerLoad = async ({ locals }) => {
	// redirect user if logged in
	if (locals.user) {
		return redirect(302, '/dashboard');
	}
};

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		const confirmPassword = formData.get('confirmPassword')?.toString() || '';
		const title = formData.get('title')?.toString() || '';
		const role = formData.get('role')?.toString() || '';

		const formSchema = object({
			name: string().required('Full name is required'),
			email: string().email('Invalid email format').required('Email is required'),
			password: string()
				.required('Password is required')
				.min(8, 'Password must be at least 8 characters')
				.matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol')
				.matches(/[0-9]/, 'Password must contain at least one number')
				.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
				.matches(/[a-z]/, 'Password must contain at least one lowercase letter'),
			confirmPassword: string()
				.oneOf([ref('password')], 'Passwords must match')
				.required('Confirm password is required'),
			title: string().required('Job title is required'),
			role: string().required('Department/Role is required')
		});

		try {
			// Serve side form validation
			await formSchema.validate(
				{ name, email, password, confirmPassword, title, role },
				{ abortEarly: false }
			);

			// Check if user with the same email already exists
			const checkUser = await isUserExist(email);

			if (checkUser) {
				return fail(400, { message: 'A user with this email already exists' });
			}

			const hashedPassword = await hashPassword(password);

			const data = {
				name,
				email,
				password: hashedPassword,
				title,
				role,
				isAdmin: true,
				isActive: true
			};

			const user = await addUser(data);

			if (!user) {
				return fail(400, { message: 'Error adding user' });
			}
		} catch (error: any) {
			const validationErrors: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((err: any) => {
					validationErrors[err.path] = err.message;
				});

				return fail(400, { input: { name, email, title, role }, errors: validationErrors });
			} else {
				return fail(400, { message: 'Error adding user' });
			}
		}
	}
};
