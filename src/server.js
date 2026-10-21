import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './middleware/logger.js';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { ErrorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import authRouter from './routes/authRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import storesRouter from './routes/storesRoutes.js';
import productsRouter from './routes/productsRoutes.js';
import cartRouter from './routes/cartRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(logger);

app.use('/api/user', authRouter);
app.use('/api', reviewRouter);
app.use('/api', storesRouter);
app.use('/api', productsRouter);
app.use('/api', cartRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(ErrorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is runnung on port ${PORT}`);
});
