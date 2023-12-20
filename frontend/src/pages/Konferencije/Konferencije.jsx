import './Konferencije.css'
import FallingAnimation from '../../FallingAnimation';
import { Link } from 'react-router-dom'
import { useAuth } from '../../AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const Konferencije = () => {
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
                    setPodaci(data);
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

    return(
        <>
        <FallingAnimation>
        <hr></hr>
        <div className='konfContainer'>
            <div className='tekst'>Aktivne konferencije: </div>
                <div className='aktivne'>
                    <Aktivne aktivne={konferencije.aktivne} />
                <div/>
            <div className='tekst'>Nadolazeće konferencije: </div>
                <div className='nadolazece'>
                    <Nadolazeće nadolazece={konferencije.nadolazece} />
                </div>
            </div>
        </div>
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

const Aktivne = ({aktivne}) => {
    const { isAuthenticated } = useAuth();
    
    return (
        <div>
            {aktivne && aktivne.map((konf, index) => (
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

const Nadolazeće = ({nadolazece}) => {
    return (
        <div>
            {nadolazece && nadolazece.map((konf, index) => (
                <div className='konferencija' key={index}>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>{konf.naziv}</span>
                        <span className='mjesto'>{konf.mjesto}</span>
                        <span className='opis'>{konf.opis}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Konferencije;