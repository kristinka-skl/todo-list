import app from './app.js';
import config from './config/config.js';
import { connectMongoDB } from './db/connectMongoDB.js';

await connectMongoDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
