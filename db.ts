import { DataSource } from "typeorm"
import dotenv from 'dotenv'

dotenv.config()

const portStr = process.env.TYPEORM_PORT;
if (!portStr) {
  throw new Error('TYPEORM_PORT is not defined');
}
const port = parseInt(portStr);
export const myDataBase = new DataSource({
    type: process.env.TYPEORM_CONNECTION as 'mysql',
    host: process.env.TYPEORM_HOST,
    port: parseInt(portStr),
    username: process.env.TYPEORM_USERNAME,
    password:process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [process.env.NODE_ENV ==='production'?'dist/src/entity/*.js':"src/entity/*.ts"],
    logging: true, 
    synchronize: true, 
})