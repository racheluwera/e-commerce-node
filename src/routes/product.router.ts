import { Router } from "express";
import { adminOnly, authenticate } from "../middleware/auth.middleware";
import { deleteProduct, getProduct, getProductById, newProduct, updateProduct } from "../controllers/product.controller";
import { upload } from "../middleware/uploadMiddleware";
const  ProductRoute=Router();
ProductRoute.use(authenticate);   //Protect All endpoint

ProductRoute.get("/products",getProduct);
ProductRoute.get("/products/:id",getProductById)
ProductRoute.post("/products", adminOnly, upload.single("image"), newProduct);
ProductRoute.put("/products/:id", adminOnly, updateProduct);
ProductRoute.delete("/products/:id", adminOnly, deleteProduct)

export default ProductRoute;

