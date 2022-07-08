import express from "express";
import usersRepo from "./repositories/users.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `)
});

app.post("/", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    
    if (existingUser) {
        return res.send(`A user with the email ${email} already exists.`);
    }

    if (password !== passwordConfirmation) {
        return res.send(`Ensure that the passwords match.`)
    }

    await usersRepo.create({ email, password, passwordConfirmation });

    res.send(`
    <p>You've created an account for: ${email}.</p>
    `)
})

app.listen(5001, () => {});