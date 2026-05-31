import express from 'express';
// import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';
// import cookieParser from "cookie-parser";
import { errors } from "celebrate";
// import { notFoundHandler } from './middlewares/notFoundHandler.js';


const app = express();

const corsOptions = {
  origin: '',
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));
app.use(express.json({
      type: ['application/json'],
      limit: '100kb',
    }));
// app.use(cookieParser());

// app.use(tasksRouter);


// app.use(notFoundHandler);
app.use(errors());
// app.use(errorHandler);

export default app;
