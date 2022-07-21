import express from "express";
import { validationResult } from "express-validator";
import productsRepo from "../../repositories/products.js";
import productsNewTemplate from "../../views/admin/products/new.js";
import validators from "./validators.js";
const { requireTitle, requirePrice } = validators;

const router = express.Router();

router.get("/admin/products", (req, res) => {});
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post("/admin/products/new",
    [
    requireTitle,
    requirePrice,
    ],
(req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    res.send("submitted...")
})

export default router;