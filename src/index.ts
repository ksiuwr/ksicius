import mongoose from 'mongoose';

import { initializeBot } from './bot';
import { MONGO_CONNECTION_LINK } from './config';

(async () => {
	mongoose.set('strictQuery', true);
	await mongoose.connect(MONGO_CONNECTION_LINK);

	await initializeBot();
})();
