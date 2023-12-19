import './Konferencije.css'
import FallingAnimation from '../../FallingAnimation';
import { Link } from 'react-router-dom'
import { useAuth } from '../../AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const Konferencije = () => {

    return(
        <>
        <FallingAnimation>
        <hr></hr>
        <div className='konfContainer'>
            <div className='tekst'>Aktivne konferencije: </div>
                <div className='aktivne'>
                    <Aktivne />
                <div/>
            <div className='tekst'>Nadolazeće konferencije: </div>
                <div className='nadolazece'>
                    <Nadolazeće />
                </div>
            </div>
        </div>
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

const Aktivne = () => {
    const { isAuthenticated } = useAuth();
    const [konferencije, setPodaci] = useState([])
    useEffect(() => {
        const fetchKonferencije = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/konferencije', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPodaci(data.konferencije);
                } else {
                    throw new Error('Problem s dohvatom konferencija');
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
                throw new Error('Problem s dohvatom konferencija');
            }
        };

        fetchKonferencije();
    }, []);

 /*   const listaAktivnih = [
        {'ime': 'Konferencija 1',
         'mjesto': 'Varaždin',
         'opis': 'Opis 1',
         'id': '1'},
        {'ime': 'Konferencija 2',
         'mjesto': 'Zagreb',
         'opis': 'Opis 2',
         'id': '2'},
        {'ime': 'Konferencija 3',
         'mjesto': 'Split',
         'opis': 'Opis 3',
         'id': '3'}
    ] */
    
    return (
        <div>
            {konferencije.map((konf, index) => (
                <div className='konferencija' key={index}>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>{konf.naziv}</span>
                        <span className='mjesto'>{konf.mjesto}</span>
                        <span className='opis'>{konf.opis}</span>
                    </div>
                    {isAuthenticated && (
                        <div className='pristupi'>
                            <Link to='/poster'>
                                <button className='pristupibutton'>PRISTUPI</button>
                            </Link>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

const Nadolazeće = () => {
    const listaNadolazecih = [
        {'ime': 'Konferencija 1',
         'datum': '2.1.2024',
         'opis': 'Opis 1',
         'id': '4'},
        {'ime': 'Konferencija 2',
         'datum': '5.1.2024.',
         'opis': 'Opis 2',
         'id': '5'},
        {'ime': 'Konferencija 3',
         'datum': '16.1.2024.',
         'opis': 'Opis 3',
         'id': '6'}
    ]

    return (
        <div>
            {listaNadolazecih.map((konferencija, index) => (
            <div className='konferencija' key={index}>
                <div className='konfImg'></div>
                <div className='texts'>
                    <span className='naziv'>{konferencija.ime}</span>
                    <span className='datum'>{konferencija.datum}</span>
                    <span className='opis'>{konferencija.opis}</span>
                </div>
            </div>
        ))}
        </div>
    )
}


export default Konferencije;