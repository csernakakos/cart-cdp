import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import authRouter from "./routes/admin/auth.js";
import productsRouter from "./routes/admin/products.js";

dotenv.config({});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: [process.env.COOKIE_KEY],
}));

app.use(authRouter);
app.use(productsRouter);

app.listen(5001, () => {console.log(`listening on http://localhost:5001/`)});