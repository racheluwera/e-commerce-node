import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { deleteProduct, getProduct, getProductById, newProduct, updateProduct } from "../controllers/product.controller";
const  ProductRoute=Router();
// ProductRoute.use(authenticate);   //Protect All endpoint

ProductRoute.get("/products",getProduct);
ProductRoute.get("/products/:id",getProductById)
ProductRoute.post("/products",newProduct)
ProductRoute.put("/products/:id",updateProduct);
ProductRoute.delete("/products/:id",deleteProduct)

export default ProductRoute;

