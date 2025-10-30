import type { Component } from 'svelte';
import {
	ChevronDoubleUpOutline,
	ChevronDownOutline,
	ChevronSortOutline,
	ChevronUpOutline
} from 'flowbite-svelte-icons';

export enum TaskPriority {
	HIGH = 'HIGH',
	MEDIUM = 'MEDIUM',
	NORMAL = 'NORMAL',
	LOW = 'LOW'
}

export enum TaskStage {
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED'
}

export enum ActivityType {
	ASSIGNED = 'ASSIGNED',
	STARTED = 'STARTED',
	IN_PROGRESS = 'IN_PROGRESS',
	BUG = 'BUG',
	COMPLETED = 'COMPLETED',
	COMMENTED = 'COMMENTED'
}

export type User = {
	id: string;
	email: string;
	name: string;
	title: string;
	role: string;
	isAdmin: boolean;
	isActive: boolean;
};

export type Task = {
	id: string;
	title: string;
	date: Date;
	priority: string;
	stage: string;
	assets?: string[];
	activities?: Activity[];
	subTasks?: SubTask[];
	team?: User[];
	isTrashed?: boolean;
};

export type Activity = {
	id: string;
	type: string;
	activity: string;
	date: Date;
	by: string;
};

export type SubTask = {
	id: string;
	title: string;
	date: Date;
	tag: string;
};

export function safeStringToEnum<T extends Record<string, any>>(
	enumeration: T,
	inputString: string | undefined | null,
	defaultValue: T[keyof T]
): T[keyof T] {
	if (!inputString) {
		return defaultValue;
	}

	const enumValues = Object.values(enumeration);

	if (enumValues.includes(inputString)) {
		return inputString as T[keyof T];
	}

	return defaultValue;
}

export const formatDate = (date: any) => {
	// Get the month, day, and year
	const month = date.toLocaleString('en-US', { month: 'short' });
	const day = date.getDate();
	const year = date.getFullYear();

	const formattedDate = `${day}-${month}-${year}`;

	return formattedDate;
};

export function dateFormatter(dateString: any) {
	const inputDate: any = new Date(dateString);

	if (isNaN(inputDate)) {
		return 'Invalid Date';
	}

	const year = inputDate.getFullYear();
	const month = String(inputDate.getMonth() + 1).padStart(2, '0');
	const day = String(inputDate.getDate()).padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
}

export function getInitials(fullName: string) {
	const names = fullName.split(' ');

	const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

	const initialsStr = initials.join('');

	return initialsStr;
}

export const PRIOTITYSTYLES: Record<string, string> = {
	high: 'text-red-600',
	medium: 'text-yellow-600',
	low: 'text-blue-600'
};

export const TASK_STYLES: Record<string, string> = {
	todo: 'text-blue-500',
	'in progress': 'text-yellow-500',
	completed: 'text-green-500'
};

export const BG_STYLES: Record<string, string> = {
	high: 'bg-red-100',
	medium: 'bg-yellow-100',
	low: 'bg-blue-100',
	normal: 'bg-stone-200'
};

export const TASK_TYPE: Record<string, string> = {
	todo: 'bg-blue-500',
	'in progress': 'bg-yellow-500',
	completed: 'bg-green-500'
};

export const BGS: string[] = ['bg-blue-600', 'bg-yellow-600', 'bg-red-600', 'bg-green-600'];

export const LISTS: string[] = ['TODO', 'IN PROGRESS', 'COMPLETED'];

export const PRIORITY: string[] = ['HIGH', 'MEDIUM', 'NORMAL', 'LOW'];

export const ICONS: Record<string, Component> = {
	high: ChevronDoubleUpOutline,
	normal: ChevronSortOutline,
	medium: ChevronUpOutline,
	low: ChevronDownOutline
};
