import { comparePassword } from '$lib/bcrpyt.js';
import { lucia } from '$lib/server/auth';
import { isUserExist } from '$lib/server/user.js';
import { fail, redirect } from '@sveltejs/kit';
import { object, string } from 'yup';

export const load = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
};

export const actions = {
	login: async ({ cookies, request }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';

		// Define the validation schema
		const formSchema = object({
			email: string().email('Invalid email format').required('Email is required'),
			password: string()
				.min(6, 'Password must be at least 6 characters')
				.required('Password is required')
		});

		try {
			// validate form data
			formSchema.validateSync({ email, password }, { abortEarly: false });

			const user = await isUserExist(email);

			if (!user) {
				console.log('invalid email');
				return fail(400, { message: 'Invalid email or password' });
			}

			if (!user?.isActive) {
				return fail(400, { message: 'Your account is inactive. Please contact admin.' });
			}

			const isMatch = await comparePassword(password, user?.password);

			if (!isMatch) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const session = await lucia.createSession(user.id, {});

			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error: any) {
			const validationError: Record<string, unknown> = {};

			if (error.inner) {
				error.inner.forEach((error: any) => {
					validationError[error.path] = error.message;
				});
				return fail(400, { input: { email }, errors: validationError });
			}

			console.log('Error logging in.', error);
			return fail(400, { message: 'Error loging in' });
		}
	}
};
