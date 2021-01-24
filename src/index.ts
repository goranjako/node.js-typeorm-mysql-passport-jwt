import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as bodyParser from "body-parser";
import "reflect-metadata";
import passportManager from './middlewere/passport';
import {createConnection, Connection} from 'typeorm';
import* as  dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.routes'
import { connected } from 'process';

const app = express();
//createConnection();
async function intializeDB (): Promise<Connection> {
    const connection = await createConnection()
    return connection;
  }
  intializeDB().then(connected => { console.log('Connected to DB');})
  .catch((err: any) => {
    console.log(`DB connection error. Please make sure DB is running. ${err}`);
    // process.exit();
});
// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passportManager.initialize());
// routes
app.use(userRoutes);


app.listen(3000);
console.log('Server on port', 3000);