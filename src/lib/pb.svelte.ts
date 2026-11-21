import PocketBase from 'pocketbase';

import { PB_BASE_URL } from '$app/env/public';

import type { MessagesRecord, TypedPocketBase, UsersRecord } from './pb.types';

export const pb = new PocketBase(PB_BASE_URL) as TypedPocketBase;

export const pbAuth = $state<{ email: string; rec: UsersRecord | null }>({ email: '', rec: null });
pb.authStore.onChange((_, rec) => {
	pbAuth.email = (rec as UsersRecord | null)?.email ?? '';
	pbAuth.rec = rec as UsersRecord | null;
});

export type Message_t = MessagesRecord & { sha256: string };
