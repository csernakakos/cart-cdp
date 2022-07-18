import layout from "../layout.js";
import { getError } from "../../../views/helpers.js";

const signup = ({ req, errors }) => {
    return layout({ template: `
    <div>
        Your userId is ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            ${getError(errors, "email")}
            <input name="password" placeholder="password" />
            ${getError(errors, "password")}
            <input name="passwordConfirmation" placeholder="password confirmation" />
            ${getError(errors, "passwordConfirmation")}
            <button>Sign Up</button>
        </form>
    </div>   
    `});
}

export default signup;