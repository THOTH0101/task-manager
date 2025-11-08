import {
	ActivityType,
	TaskPriority,
	TaskStage,
	type Activity,
	type SubTask,
	type Task,
	type User
} from '$lib';
import db from './database';

export const addTask = async (task: {
	title: string;
	date: Date;
	description: string;
	stage: TaskStage;
	priority: TaskPriority;
	users: { id: string }[];
	assets?: string[];
}) => {
	try {
		const result = await db.task.create({
			data: {
				title: task.title,
				date: task.date,
				description: task.description,
				stage: task.stage,
				priority: task.priority,
				assets: task.assets,
				teamUsers: { connect: task.users }
			},
			select: { id: true }
		});

		return result;
	} catch (error) {
		console.log('Error adding task:', error);
	}
};

export const addSubTask = async (
	subTask: { title: string; date: Date; tag: string },
	taskId: string
) => {
	try {
		const result = await db.subTask.create({
			data: {
				task: { connect: { id: taskId } },
				title: subTask.title,
				date: subTask.date ?? null,
				tag: subTask.tag ?? ''
			},
			select: { id: true }
		});

		return result;
	} catch (error) {
		console.log('Error adding sub-task:', error);
	}
};

export const updateSubTask = async (data: object, subTaskId: string) => {
	try {
		const result = await db.subTask.update({
			data,
			where: { id: subTaskId },
			select: { id: true }
		});

		return result;
	} catch (error) {
		console.log('Error updating sub-task:', error);
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
				subTasks: { select: { id: true, title: true, date: true, tag: true, isCompleted: true } }
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const tasks: Task[] =
			result?.map((task): Task => {
				const priority = (TaskPriority[task.priority] as string).toLowerCase();
				const stage = (TaskStage[task.stage] as string).toLowerCase();

				const activities = task.activities.map((activity): Activity => {
					const type = (ActivityType[activity.type] as string).toLowerCase();
					return {
						id: activity.id,
						type,
						date: activity.date,
						by: activity.byUserId,
						activity: activity.activity ?? ''
					};
				});

				return {
					id: task.id,
					title: task.title,
					date: task.date,
					assets: task.assets,
					isTrashed: task.isTrashed,
					activities,
					subTasks: task.subTasks as SubTask[],
					team: task.teamUsers as User[],
					priority,
					stage,
					description: task.description ?? ''
				};
			}) ?? [];

		return tasks;
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
					select: {
						id: true,
						type: true,
						activity: true,
						date: true,
						by: { select: { id: true, name: true } }
					}
				},
				subTasks: { select: { id: true, title: true, date: true, tag: true, isCompleted: true } }
			}
		});

		const priority = (TaskPriority[result?.priority ?? 'NORMAL'] as string).toLowerCase();
		const stage = (TaskStage[result?.stage ?? 'TODO'] as string).toLowerCase().replace('_', ' ');

		const activities = result?.activities.map((activity): Activity => {
			const type = (ActivityType[activity.type] as string).toLowerCase().replace('_', ' ');
			return {
				id: activity.id,
				type,
				date: activity.date,
				by: activity.by.name,
				activity: activity.activity ?? ''
			};
		});

		const task: Task = {
			id: result?.id as string,
			title: result?.title as string,
			date: result?.date as Date,
			assets: result?.assets,
			isTrashed: result?.isTrashed,
			activities,
			subTasks: result?.subTasks as SubTask[],
			team: result?.teamUsers as User[],
			priority,
			stage,
			description: result?.description as string
		};

		return task;
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
