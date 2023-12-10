import { useRef, useState, useEffect } from 'react'
import axios from "axios";
import './Registracija.css'

const Registracija = () => {

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [ime, setIme] = useState('')
    const [prezime, setPrezime] = useState('')
    const [success, setSuccess] = useState(false)



    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(ime, prezime, user, pwd)

        try{
            const response = await axios({
                method: 'post',
                url: 'http://localhost:5173/login'
            })
            console.log(response.data)
        } catch (err) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
        <div className="background">
            <div className="registrationBody">
                <div className="first">
                <form className="registrationForm" onSubmit={handleSubmit}>
                    <div className="textInputs">
                        <label htmlFor='name'>
                            <input type='text' 
                            className='registrationInputText'
                            id='name'
                            placeholder='Unesite ime'
                            onChange={(e) => setIme(e.target.value)}
                            value={ime}
                            ></input>
                        </label>
                        <label htmlFor='prezime'>
                            <input type='text' 
                            className='registrationInputText'
                            id='prezime'
                            placeholder='Unesite prezime'
                            onChange={(e) => setPrezime(e.target.value)}
                            value={prezime}
                            ></input>
                        </label>
                        <label htmlFor='username'>
                            <input type='text' 
                            id='username'
                            className='registrationInputText' 
                            placeholder='Korisničko ime'
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required></input>
                        </label>
                        <label htmlFor='password'>
                            <input type='password' 
                            className='registrationInputText'
                            id='password'
                            placeholder='Lozinka'
                            onChange={(e) => setPwd(e.target.value)} 
                            value={pwd}
                            ></input>
                        </label>
                        <button className='registrationInputSubmit'>Log in</button>
                    </div>

                </form>  
                </div>
                <div className="seconds">
                    <h1 className="welcome">Bok!</h1>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default Registracija