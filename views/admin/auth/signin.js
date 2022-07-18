import layout from "../layout.js";
import { getError } from "../../../views/helpers.js";

const signin = ({ errors }) => {
    return layout({template: `
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            ${getError(errors, "email")}
            <input name="password" placeholder="password" />
            ${getError(errors, "password")}
            <button>Sign In</button>
        </form>
    </div>
    `});
}

export default signin;