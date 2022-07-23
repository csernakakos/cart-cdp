import express from "express";
import multer from "multer";

import validatorFunctions from "./middlewares.js";
const { handleErrors } = validatorFunctions;
import productsRepo from "../../repositories/products.js";
import productsNewTemplate from "../../views/admin/products/new.js";
import validators from "./validators.js";
const { requireTitle, requirePrice } = validators;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get("/admin/products", (req, res) => {});
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post("/admin/products/new",
    upload.single("image"),
    [
    requireTitle,
    requirePrice,
    ],
    handleErrors(productsNewTemplate),
async (req, res) => {
 
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    
    await productsRepo.create({ title, price, image });

    res.send("submitted...");
})

export default router;