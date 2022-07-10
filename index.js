import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import usersRepo from "./repositories/users.js";

dotenv.config({});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: [process.env.COOKIE_KEY],
}))

app.get("/signup", (req, res) => {
    res.send(`
        <div>
            Your userId is ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `)
});

app.post("/signup", async (req, res) => {
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

app.get("/signout", async (req, res) => {
    req.session = null;
    res.send("You are now logged out.");
});

app.get("/signin", (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
    `)
});

app.post(`/signin`, async (req, res) => {
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

})



app.listen(5001, () => {});