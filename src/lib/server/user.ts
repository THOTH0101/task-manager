import type { User } from '$lib';
import db from './database';

export const addUser = async (
	user: {
		name: string;
		title: string;
		role: string;
		email: string;
		password: string;
		isAdmin: boolean;
		isActive: boolean;
	},
	managerId: string = ''
) => {
	try {
		let result;

		if (user.isAdmin) {
			result = await db.user.create({ data: user, select: { id: true } });

			const managerId = result.id as string;
			await db.user.update({ where: { id: managerId }, data: { managerId } });
		} else {
			result = await db.user.create({ data: { ...user, managerId }, select: { id: true } });
		}

		return result;
	} catch (error) {
		console.log('Error adding user: ', error);
	}
};

export const updateUser = async (data: object, email: string) => {
	try {
		const result = await db.user.update({ data, where: { email }, select: { id: true } });

		return result;
	} catch (error) {
		console.log('Error updating user: ', error);
	}
};

export const deleteUser = async (userId: string) => {
	try {
		const result = await db.user.delete({ where: { id: userId }, select: { id: true } });

		return result;
	} catch (error) {
		console.log('Error deleting user: ', error);
	}
};

export const getUserById = async (userId: string) => {
	try {
		const result = await db.user.findUnique({ where: { id: userId } });

		const user: User = {
			id: result?.id as string,
			email: result?.email as string,
			name: result?.name as string,
			title: result?.title as string,
			role: result?.role as string,
			isAdmin: result?.isAdmin as boolean,
			isActive: result?.isActive as boolean
		};

		return user;
	} catch (error) {
		console.log('Error getting list of user: ', error);
	}
};

export const getUserList = async (managerId: string) => {
	try {
		const result = await db.user.findMany({ where: { managerId } });

		const users: User[] | undefined = result?.map((user): User => {
			return {
				id: user?.id as string,
				email: user?.email as string,
				name: user?.name as string,
				title: user?.title as string,
				role: user?.role as string,
				isAdmin: user?.isAdmin as boolean,
				isActive: user?.isActive as boolean
			};
		});

		return users;
	} catch (error) {
		console.log('Error getting list of user: ', error);
	}
};

export const isUserExist = async (email: string) => {
	try {
		const user = await db.user.findUnique({ where: { email } });

		return user;
	} catch (error) {
		console.log('Error checking user: ', error);
	}
};
