import { NoticeType, type Notice, type Task, type User } from '$lib';
import db from './database';

export const addNotice = async (
	data: { text: string; users: { id: string }[] },
	taskId: string
) => {
	try {
		const result = await db.notice.create({
			data: {
				text: data.text,
				teamRecipients: { connect: data.users },
				task: { connect: { id: taskId } }
			}
		});

		return result;
	} catch (error) {
		console.log('Error adding notice:', error);
	}
};

export const markAsRead = async (userId: string, noticeId: string) => {
	try {
		const result = await db.user.update({
			where: { id: userId },
			data: { noticesRead: { connect: { id: noticeId } } }
		});

		return result;
	} catch (error) {
		console.log('Error reading notice:', error);
	}
};

export const markAllAsRead = async (userId: string) => {
	try {
		const notices = await db.user.findUnique({
			where: {
				id: userId
			},
			select: {
				noticesReceived: {
					select: {
						id: true
					}
				}
			}
		});

		const noticesId = notices?.noticesReceived.map((notice) => ({ id: notice.id })) ?? [];

		const result = await db.user.update({
			where: { id: userId },
			data: { noticesRead: { set: noticesId } }
		});

		return result;
	} catch (error) {
		console.log('Error reading all notice:', error);
	}
};

export const getUserNotice = async (userId: string) => {
	try {
		const result = await db.notice.findMany({
			where: { teamRecipients: { some: { id: userId } } },
			include: { task: { select: { id: true, title: true } }, readBy: { select: { id: true } } }
		});

		return result;
	} catch (error) {
		console.log('Error getting unread notice:', error);
	}
};

export const getUserUnreadNotice = async (userId: string) => {
	try {
		const result = await db.notice.findMany({
			where: { teamRecipients: { some: { id: userId } }, readBy: { none: { id: userId } } },
			include: { task: { select: { id: true, title: true } }, readBy: { select: { id: true } } }
		});

		const notices: Notice[] = result?.map((notice): Notice => {
			return {
				id: notice.id,
				text: notice.text,
				task: notice.task as Task,
				notiType: NoticeType[notice.notiType],
				readBy: notice.readBy as User[],
				createdAt: notice.createdAt
			};
		});

		return notices;
	} catch (error) {
		console.log('Error getting notice:', error);
	}
};
