import express from 'express';
import cors from 'cors';
// import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import tasksRouter from './routes/taskRouter';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

const corsOptions = {
  origin: '',
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));
app.use(express.json({
      type: ['application/json'],
      limit: '100kb',
    }));
// app.use(cookieParser());

app.use('/api', tasksRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

export default app;
