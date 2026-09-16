import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { environment } from '../../../environments/environment';

const firebaseApp = initializeApp(environment.firebase);

export const firebaseAuth = getAuth(firebaseApp);
