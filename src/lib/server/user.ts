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

		return result;
	} catch (error) {
		console.log('Error getting list of user: ', error);
	}
};

export const getUserList = async (managerId: string) => {
	try {
		const result = await db.user.findMany({ where: { managerId } });

		return result;
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
