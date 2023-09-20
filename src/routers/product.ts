import { Router } from 'express';
import { upload } from '../uploadS3'
import { ProductController } from '../controller/ProductController';

const routes = Router();

routes.get('', ProductController.getProducts);
routes.get('', ProductController.getProductsByCategoryName);
routes.post('', upload.array('image', 6), ProductController.createProduct);
export default routes;