import express from "express"
import cors from 'cors'
import { myDataBase } from "../db";
import AuthRouter from './routers/auth';
export const tokenList = {};


myDataBase
.initialize()
.then(() => {
  console.log('DataBase has been initialized!');
})
.catch((err) => {
  console.error('Error during DataBase initialization:', err);
});

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  }),
);

const port = process.env.PORT || 3000;
app.use('/auth', AuthRouter);


app.listen(port, () => {
    console.log("Express server has started on port 3000")
})