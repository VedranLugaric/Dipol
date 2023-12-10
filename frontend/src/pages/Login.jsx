
import './Login.css'

const Login = () => {
    return (
        <>
            <div className='background'>
                <div className='loginBody'>
                    <div className='first'>
                        <h1 className='welcome'>Dobrodošli natrag!</h1>
                    </div>
                    <div className='second'>
                        <LoginForm />
                    </div>
                </div>
            </div>
            
        </>
    )
}

const LoginForm = () => {
    return (
        <>
        <form className='loginForm'>
            <div className='textInputs'>
                <label>
                    <input type='text' className='loginInputText' placeholder='Korisničko ime'></input>
                </label>
                <label>
                    <input type='password' className='loginInputText' placeholder='Lozinka' ></input>
                </label>
            </div>
                <input type='submit' className='loginInputSubmit'></input>
        </form>
        </>
    )
}

export default Login