import express from "express";

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

app.post("/", (req, res) => {
    console.log(req.body, "<<< from urlencoded")
    res.send(`
    <p>You created an account for: ${req.body.email}.</p>
    `)
})

app.listen(5001, () => {});