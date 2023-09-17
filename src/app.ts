import express from "express"
import { Request, Response } from "express"
import cors from 'cors'
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

app.get('/', function(req, res){ 
    res.send('서버를 실행해보자 :)'); 
});

app.listen(port, () => {
    console.log("Express server has started on port 3000")
})