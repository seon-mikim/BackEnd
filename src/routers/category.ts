import Router from 'express';

import { CategoryController } from '../controller/CategoryController';


const routes = Router();

routes.post('', CategoryController.createCategory);


export default routes;