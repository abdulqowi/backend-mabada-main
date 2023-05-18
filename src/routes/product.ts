import { Router } from 'express';
import { getProducts, createProduct, editProduct, categories } from '../controllers/product';
import { auth } from "../middlewares/auth";

export const productRouter = Router();

productRouter
    .get('/', getProducts)
    .get('/categories', categories)
    .post('/add',auth(true), createProduct)
    .put('/edit/:id', editProduct);

export default productRouter;
