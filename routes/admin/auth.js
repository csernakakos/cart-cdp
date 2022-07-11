import express from "express";
import { check, validationResult } from "express-validator";
import usersRepo from "../../repositories/users.js";
import signupTemplate from "../../views/admin/auth/signup.js";
import signinTemplate from "../../views/admin/auth/signin.js";
import validators from "./validators.js";
const { requireEmail, requirePassword, requirePasswordConfirmation } = validators;


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
    
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password } = req.body;
        const user = await usersRepo.create({ email, password });


        
        req.session.userId = user.id;

        res.send(`
        <p>You've created an account for: ${email}.</p>
        `)
});

router.get("/signout", async (req, res) => {
    req.session = null;
    res.send("You are now logged out.");
});

router.get("/signin", (req, res) => {
    res.send(signinTemplate());
});

router.post(`/signin`, async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    
    if (!user) {
        return res.send("Email not found.");
    };

    const validPassword = await usersRepo.comparePasswords(user.password, password);

    if (!validPassword) {
        return res.send("Wrong password.");
    };

    req.session.userId = user.id;

    res.send(`You're signed in! Your ID is ${req.session.userId}`);
});

export default router;