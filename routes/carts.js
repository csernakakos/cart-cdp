import express from "express";
import cartsRepo from "../repositories/carts.js"
import productsRepo from "../repositories/products.js";
import cartShowTemplate from "../views/carts/show.js";

const router = express.Router();

router.post("/cart/products", async (req, res) => {
    let cart;
    // if cartID does not yet exist in cookies
    if (!req.session.cartID) {

        // create empty cart with empty items array
        cart = await cartsRepo.create({ items: [] });

        // set the cartID cookie to cart.id
        req.session.cartID = cart.id;
    } else {
        // find the exact cart in database
        cart = await cartsRepo.getOne(req.session.cartID);
    }

    const existingItem = cart.items.find((item) => item.id === req.body.productID);

    if (existingItem) {
        // Increase quantity of existing item in cart
        existingItem.quantity++;
    } else {
        // Push a new item with productID (from <input />) to cart
        cart.items.push({
            id: req.body.productID,
            quantity: 1,
        });
    };

    // Update cart in cartsRepo, making its items equal to cart.items
    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.redirect("/cart");
});

router.get("/cart", async (req, res) => {
    if (!req.session.cartID) {
        return res.redirect("/");
    };

    const cart = await cartsRepo.getOne(req.session.cartID);

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product;

    }
    res.send(cartShowTemplate({ items: cart.items }))
});

router.post("/cart/products/delete", async (req, res) => {
    const { itemID } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartID);

    const items = cart.items.filter((item) => {item.id !== itemID});

    await cartsRepo.update(req.session.cartID, { items });

    res.redirect("/cart");
})

export default router;