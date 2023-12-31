import FallingAnimation from '../../FallingAnimation'
import './Poster.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

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

    const [radovi, setPodaci] = useState([])

    useEffect(() => {
        const fetchRadovi = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/poster/1', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPodaci(data.rezultat);
                } else {
                    throw new Error('Problem s dohvatom radova');
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
                throw new Error('Problem s dohvatom radova');
            }
        };

        fetchRadovi();
    }, []);

    return (
        <>
            <FallingAnimation>
                <div>
                    <Rad radovi={radovi} />
                </div>
            </FallingAnimation>
        </>
    )

    //    return (
    //        <>
    //            <FallingAnimation>
    //                <hr></hr>
    //                <div className='postercontainer'>
    //                    <div className='poster-left'>
    //                        <img className='poster2' src='/public/slike/poster_2.jpg'></img>
    //                        <div className='sideblur'></div>
    //                    </div>
    //                    <div className='poster-middle'>
    //                        <img className='poster1' src='/public/slike/poster_1.png'>
    //                        </img>
    //                        <button className='glasaj'>GLASAJ</button>
    //                    </div>
    //                    <div className='poster-right'>
    //                        <img className='poster3' src='/public/slike/poster_3.jpg'></img>
    //                        <div className='sideblur'></div>
    //                    </div>
    //                </div>
    //                <hr></hr>
    //                <div className='contents'>
    //                    <button className='prev'></button>
    //                    <span className='posternaziv'>Trenutni poster: Naziv</span>
    //                    <button className='next'></button>
    //                </div>
    //                <div className='opispostera'>
    //                    <p>Kombinacija bogatih boja
    //                        i izražajnih linija stvara
    //                        dinamičan prikaz umjetnosti.
    //                        Središnji motiv privlači pažnju
    //                        svojom dubinom i emotivnom snagom,
    //                        dok se oko njega misteriozno stapaju
    //                        oblici i teksture.
    //                        Svaki detalj poziva na promišljanje
    //                        i istraživanje, stvarajući vizualno
    //                        iskustvo koje intrigira i nadahnjuje.</p>
    //                </div>
    //                <div className='empty'></div>
    //            </FallingAnimation>
    //        </>
    //    )
}

const Rad = ({ radovi }) => {

    const radoviArray = Array.isArray(radovi[1]) ? radovi[1] : [];
    const imeArray = Array.isArray(radovi[0]) ? radovi[0] : [];

    return (
        <div>
            {imeArray.map((rad, index) => (
                <div className='rad' key={rad.id}>
                    <div className='texts'>
                        <span className='naslov'>{rad.nazivKonf}</span>
                    </div>
                </div>
            ))}
            {radoviArray.map((rad, index) => (
                <div className='rad' key={rad.id}>
                    <div className='texts'>
                        <span className='naslov'>{rad.naslov}</span>
                        <span className='id'>{rad.id}</span>
                        <span className='autor'>{rad.autor}</span>
                    </div>
                    <div>
                        <button className='glasajbutton'>
                            <span class="circle1"></span>
                            <span class="circle2"></span>
                            <span class="circle3"></span>
                            <span class="circle4"></span>
                            <span class="circle5"></span>
                            <span class="text">Glasaj</span>
                        </button>
                    </div>

                    <div className='poster'>

                        <Document file={rad.poster}>
                            <Page pageNumber={1} />
                        </Document>

                        {/*}Ako želite učitavati .png/.jpg datoteku zamijeni s kodom gore
                        <div className='poster'>
                            <img className='poster1' src={rad.poster} />
                        </div>
*/}
                    </div>
                    <div className='prezentacija'>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default Poster