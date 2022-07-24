import express from "express";

import validatorFunctions from "./middlewares.js";
const { handleErrors } = validatorFunctions;
import usersRepo from "../../repositories/users.js";
import signupTemplate from "../../views/admin/auth/signup.js";
import signinTemplate from "../../views/admin/auth/signin.js";
import validators from "./validators.js";
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPassword } = validators;


const router = express.Router();

router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post("/signup",
    [
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    ],
    handleErrors(signupTemplate),
    
    async (req, res) => {
        const { email, password } = req.body;
        const user = await usersRepo.create({ email, password });

        req.session.userId = user.id;

        res.redirect("/admin/products");
});

router.get("/signout", async (req, res) => {
    req.session = null;
    res.send("You are now logged out.");
});

router.get("/signin", (req, res) => {
    res.send(signinTemplate({}));
});

router.post(`/signin`, 
    [
        requireEmailExists,
        requireValidPassword
    ],
    handleErrors(signinTemplate),
    async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect("/admin/products");
});

export default router;