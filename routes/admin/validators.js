import { check } from "express-validator";
import usersRepo from "../../repositories/users.js";

const validators = {
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must be a valid email")
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error("This email is already in use.")
            }
        }),
    requirePassword: check("password")
        .trim()
        .isLength({min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters"),
    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters")
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error("Passwords must match");
            }
    }),
    requireEmailExists: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Provide a valid email")
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({email});
            if (!user) {
                throw new Error("Email not found");
            };
    }),
    requireValidPassword: check("password")
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });

            if (!user) {
                throw new Error("Wrong password");
            }

            const validPassword = await usersRepo.comparePasswords(user.password, password);
            if (!validPassword) {
                throw new Error("Wrong password");
            }
    }),


    
}

export default validators;