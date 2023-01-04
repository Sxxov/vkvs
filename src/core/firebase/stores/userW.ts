import { userStore } from 'sveltefire';
import { auth } from '../raw/auth';

export const userW = userStore(auth);
