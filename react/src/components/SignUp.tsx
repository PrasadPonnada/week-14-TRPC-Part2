import { useState } from "react";

import { trpc } from "../../utils/trpc";

const SignUp = () => {
    const userMutation = trpc.user.signup.useMutation();
    userMutation.data?.token
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signuphandler = () => {
        userMutation.mutate({ username: email, password: password }, {
            onSuccess: ({ token }) => {
                localStorage.setItem('token', token)
            }
        })
    }

    return <div>
        <div>
            <label>Email</label>
            <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button onClick={signuphandler}>SignUp</button>
    </div>
}

export default SignUp;