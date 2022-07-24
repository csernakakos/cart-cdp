import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import authRouter from "./routes/admin/auth.js";
import productsRouter from "./routes/products.js";
import adminProductsRouter from "./routes/admin/products.js";
import cartsRouter from "./routes/carts.js"

dotenv.config({});

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: [process.env.COOKIE_KEY],
}));

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(5001, () => {console.log(`listening on http://localhost:5001/`)});