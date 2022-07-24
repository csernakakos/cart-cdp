import express from "express";
import multer from "multer";

import validatorFunctions from "./middlewares.js";
const { handleErrors, requireAuth } = validatorFunctions;
import productsRepo from "../../repositories/products.js";
import productsNewTemplate from "../../views/admin/products/new.js";
import productsIndexTemplate from "../../views/admin/products/index.js";
import productsEditTemplate from "../../views/admin/products/edit.js";
import validators from "./validators.js";
const { requireTitle, requirePrice } = validators;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get("/admin/products", requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post("/admin/products/new",
    upload.single("image"),
    [
     requireTitle,
     requirePrice,
    ],
    handleErrors(productsNewTemplate),
    requireAuth,
async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    
    await productsRepo.create({ title, price, image });
    res.redirect("/admin/products");
})

router.get("/admin/products/:id/edit", async (req, res) => {

    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
        return res.send("Product not found.");
    }

    res.send(productsEditTemplate({ product }));
});

router.post("/admin/products/:id/edit",
    requireAuth,
    upload.single("image"),
    [
        requireTitle,
        requirePrice,
    ],
    handleErrors(productsEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
       const changes = req.body;
       
       if (req.file) {
            changes.image = req.file.buffer.toString("base64");
       };

       try {
           await productsRepo.update(req.params.id, changes);
       } catch (error) {
            return res.send("Could not find product");
       }

       res.redirect("/admin/products");
});

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
    await productsRepo.delete(req.params.id);
    res.redirect("/admin/products")
})

export default router;