import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './app/middleware/notFound';
import globarErrorHandler from './app/middleware/globalErrorHanding';
import router from './app/route';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parser
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// api's
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globarErrorHandler);

app.use(notFound);

export default app;
