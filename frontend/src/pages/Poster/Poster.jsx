import FallingAnimation from '../../FallingAnimation'
import './Poster.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import React, { useEffect } from 'react';

const Poster = () => {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        //provjeri je li korisnik prijavljen
        if (!isAuthenticated) {
            //ako nije prijavljen, preusmjeri ga na login
            navigate('../login');
        }
    }, [isAuthenticated, navigate]);


    return (
        <>
            <FallingAnimation>
                <hr></hr>
                <div className='postercontainer'>
                    <div className='poster-left'>
                        <img className='poster2' src='/public/slike/poster_2.jpg'></img>
                        <div className='sideblur'></div>
                    </div>
                    <div className='poster-middle'>
                        <img className='poster1' src='/public/slike/poster_1.png'>
                        </img>
                        <button className='glasaj'>GLASAJ</button>
                    </div>
                    <div className='poster-right'>
                        <img className='poster3' src='/public/slike/poster_3.jpg'></img>
                        <div className='sideblur'></div>
                    </div>
                </div>
                <hr></hr>
                <div className='contents'>
                    <button className='prev'></button>
                    <span className='posternaziv'>Trenutni poster: Naziv</span>
                    <button className='next'></button>
                </div>
                <div className='opispostera'>
                    <p>Kombinacija bogatih boja
                        i izražajnih linija stvara
                        dinamičan prikaz umjetnosti.
                        Središnji motiv privlači pažnju
                        svojom dubinom i emotivnom snagom,
                        dok se oko njega misteriozno stapaju
                        oblici i teksture.
                        Svaki detalj poziva na promišljanje
                        i istraživanje, stvarajući vizualno
                        iskustvo koje intrigira i nadahnjuje.</p>
                </div>
                <div className='empty'></div>
            </FallingAnimation>
        </>
    )
}

export default Poster