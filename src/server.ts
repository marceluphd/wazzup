import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';

const app = express();

app.use(express.static(path.join(__dirname, '/../public')));

app.use(morgan('dev'));
app.use(compression());
app.use(helmet());

export default app;
