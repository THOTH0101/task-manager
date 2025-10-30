import type { User } from '$lib';
import { writable } from 'svelte/store';

export const openSidebar = writable(false);
export const currentTeam = writable<User[] | undefined>();
export const currentUser = writable<User>();
