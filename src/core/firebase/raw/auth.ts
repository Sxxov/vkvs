import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from './app';

export const auth = getAuth(app);
await signInAnonymously(auth);
