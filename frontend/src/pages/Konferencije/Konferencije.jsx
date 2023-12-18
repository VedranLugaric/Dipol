import './Konferencije.css'
import FallingAnimation from '../../FallingAnimation';
import { Link } from 'react-router-dom'
import { useAuth } from '../../AuthContext';

const Konferencije = () => {
    const { isAuthenticated } = useAuth();

    return(
        <>
        <FallingAnimation>
        <hr></hr>
        <div className='konfContainer'>
        <div className='tekst'>Aktivne konferencije: </div>
            <div className='aktivne'>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 1</span>
                        <span className='mjesto'>Varaždin</span>
                        <span className='opis'>Ovo je prva na popisu aktivnih konferencija</span>
                    </div>
                    {isAuthenticated && (
                        <div className='pristupi'>
                        <Link to='/poster'>
                            <button className='pristupibutton'>PRISTUPI
                            </button>
                        </Link>
                        </div>
                    )}                    
                </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 2</span>
                        <span className='mjesto'>Zagreb</span>
                        <span className='opis'>Ovo je druga na popisu aktivnih konferencija</span>
                    </div>
                    <div className='pristupi'>
                        <Link to='/poster'>
                            <button className='pristupibutton'>PRISTUPI
                            </button>
                        </Link>
                    </div>
                </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 3</span>
                        <span className='mjesto'>Split</span>
                        <span className='opis'>Ovo je treca na popisu aktivnih konferencija</span>
                    </div>
                    <div className='pristupi'>
                        <Link to='/poster'>
                            <button className='pristupibutton'>PRISTUPI
                            </button>
                        </Link>
                    </div>
                </div>
            <div/>
            <div className='nadolazece'>
            <div className='tekst'>Nadolazeće konferencije: </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 1</span>
                        <span className='datum'>2.1.2024.</span>
                        <span className='opis'>Ovo je prva na popisu nadolazecih konferencija</span>
                    </div>
                </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 2</span>
                        <span className='datum'>5.1.2024.</span>
                        <span className='opis'>Ovo je druga na popisu nadolazecih konferencija</span>
                    </div>
                </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 3</span>
                        <span className='datum'>16.1.2024.</span>
                        <span className='opis'>Ovo je treca na popisu nadolazecih konferencija</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

export default Konferencije;