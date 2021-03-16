import React from 'react'

function Register() {
    return (
        <div>
            <h1>Registor a new account</h1>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="email" placeholder="Verify your password" />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register
