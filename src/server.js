import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB';

const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.use(cors());
app.use(logger);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is runnung on port ${PORT}`);
});
