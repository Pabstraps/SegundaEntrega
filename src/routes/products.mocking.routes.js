import { Router } from "express";
import {getProducts} from '../controllers/products.mocking.controller.js';

const router = Router();

router.get("/mockingproducts", getProducts);

export default router;