import layout from "../layout.js";

const signin = () => {
    return layout({template: `
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
    `});
}

export default signin;