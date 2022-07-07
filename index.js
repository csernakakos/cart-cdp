import express from "express";

// function parseBody(req, res, next) {
//     // Let's re-create the functionality of express.urlencoded() below:
//     // req.on() is similar to addEventListener: it fires when, in our case, data in chunks (that is, the HTTP request header in chunks and later on the HTTP request body in chunks) reaches the server.
//     if (req.method === "POST") {
//         console.log("Hello from parseBody() middleware...");
//         req.on("data", data => {
//             console.log(data);
//             const parsedData = data.toString("utf8").split("&");
//             const formData = {};
    
//             for (let pair of parsedData) {
//                 // const key = pair.split("=")[0];
//                 // const value = pair.split("=")[1];
//                 const [ key, value ] = pair.split("=");
    
//                 formData[key] = value;
//             };
//             req.body = formData;
//             next();
//         });  
//     } else {
//         next();
//     }
// }

const app = express();
// app.use(parseBody);
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
    <p>You submitted ${req.body.email}</p>
    `)
})

app.listen(5001, () => {});