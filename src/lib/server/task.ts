import type { TaskPriority, TaskStage } from '$lib';
import db from './database';

export const addTask = async (task: {
	title: string;
	date: Date;
	stage: TaskStage;
	priority: TaskPriority;
	users: { id: string }[];
}) => {
	try {
		const result = await db.task.create({
			data: {
				title: task.title,
				date: task.date,
				stage: task.stage,
				priority: task.priority,
				teamUsers: { connect: task.users }
			},
			select: { id: true }
		});

		return result;
	} catch (error) {
		console.log('Error adding task:', error);
	}
};

export const updateTask = async (data: object, taskId: string) => {
	try {
		const result = await db.task.update({ data, where: { id: taskId }, select: { id: true } });

		return result;
	} catch (error) {
		console.log('Error updating task:', error);
	}
};

export const updateAllTasks = async (data: object, userId: string) => {
	try {
		const result = await db.task.updateMany({
			data,
			where: { teamUsers: { some: { id: userId } } }
		});

		return result;
	} catch (error) {
		console.log('Error updating all tasks:', error);
	}
};

export const deleteTask = async (taskId: string) => {
	try {
		const result = await db.task.delete({ where: { id: taskId }, select: { id: true } });

		return result;
	} catch (error) {
		console.log('Error deleting task:', error);
	}
};

export const deleteAllTasks = async (userId: string) => {
	try {
		const result = await db.task.deleteMany({
			where: { isTrashed: true, teamUsers: { some: { id: userId } } }
		});

		return result;
	} catch (error) {
		console.log('Error deleting all tasks:', error);
	}
};

export const getUserTasks = async (userId: string) => {
	try {
		const result = await db.task.findMany({
			where: {
				teamUsers: {
					some: {
						id: userId
					}
				},
				isTrashed: { equals: false }
			},
			include: {
				teamUsers: { select: { id: true, title: true, role: true, email: true, name: true } },
				activities: {
					select: { id: true, type: true, activity: true, date: true, byUserId: true }
				},
				subTasks: { select: { id: true, title: true, date: true, tag: true } }
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return result;
	} catch (error) {
		console.error('Error getting tasks:', error);
	}
};

export const getTaskById = async (taskId: string) => {
	try {
		const result = await db.task.findUnique({
			where: { id: taskId },
			include: {
				teamUsers: { select: { id: true, title: true, role: true, email: true, name: true } },
				activities: {
					select: { id: true, type: true, activity: true, date: true, byUserId: true }
				},
				subTasks: { select: { id: true, title: true, date: true, tag: true } }
			}
		});

		return result;
	} catch (error) {
		console.log('Error getting task by id:', error);
	}
};

export const getTrashTasks = async (userId: string) => {
	try {
		const result = await db.task.findMany({
			where: { teamUsers: { some: { id: userId } }, isTrashed: { equals: true } },
			select: { id: true, title: true, stage: true, priority: true, date: true, isTrashed: true }
		});

		return result;
	} catch (error) {
		console.log('Error getting trashed tasks:', error);
	}
};
