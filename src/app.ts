import express from "express"
import cors from 'cors'
import { myDataBase } from "../db";
import AuthRouter from './routers/auth';
import ProductRouter from './routers/product';
import CateoryRouter from './routers/category'
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
    origin: '*',
    credentials: true
  }),
);

const port = Number(process.env.PORT) || 3000;
app.use('/auth', AuthRouter);
app.use('/products',ProductRouter)
app.use('/categories',CateoryRouter)


app.listen(port, '0.0.0.0',() => {
    console.log("Express server has started on port 3000")
})