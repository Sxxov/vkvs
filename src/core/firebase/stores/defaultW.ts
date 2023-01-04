import type { CollectionReference } from 'firebase/firestore';
import { collectionStore } from 'sveltefire';
import { auth } from '../raw/auth';
import { db } from '../raw/db';

export const defaultRef = 'default';
export const defaultW = collectionStore<{
	ref: CollectionReference;
	id: string;
	[k: string]: unknown;
}>(db, defaultRef);

// ensure auth is initialised
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
auth;
