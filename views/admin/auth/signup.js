import layout from "../layout.js";

const signup = ({ req }) => {
    return layout({ template: `
    <div>
        Your userId is ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>   
    `});
}

export default signup;