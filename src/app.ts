import 'reflect-metadata'
import express from 'express';
import createConnection from './database';
// Como tenho arquivo index ele sabe e não precisa informar
import "./database";
import { router } from './routes';

createConnection()
const app = express();
app.use(express.json());
app.use(router);

export {app}