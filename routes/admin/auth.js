import express from "express";
import { check } from "express-validator";
import usersRepo from "../../repositories/users.js";
import signupTemplate from "../../views/admin/auth/signup.js";
import signinTemplate from "../../views/admin/auth/signin.js";

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post("/signup", [
    check("email"),
    check("password"),
    check("passwordConfirmation")

], async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    
    if (existingUser) {
        return res.send(`A user with the email ${email} already exists.`);
    }

    if (password !== passwordConfirmation) {
        return res.send(`Ensure that the passwords match.`)
    }


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