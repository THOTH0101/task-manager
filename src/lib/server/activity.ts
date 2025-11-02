import type { ActivityType } from '$lib';
import db from './database';

export const addActivity = async (
	data: {
		type: ActivityType;
		activity: string;
	},
	userId: string,
	taskId: string
) => {
	try {
		const result = await db.activity.create({
			data: {
				type: data.type,
				activity: data.activity,
				by: { connect: { id: userId } },
				task: { connect: { id: taskId } }
			},
			select: { id: true }
		});

		return result;
	} catch (error) {
		console.log('Error adding activity:', error);
	}
};
