import './Konferencije.css'
import FallingAnimation from '../../FallingAnimation';

const Konferencije = () => {


    return(
        <>
        <FallingAnimation>
            <hr></hr>
        <div className='konfContainer'>
            <p>Aktivne konferencije: </p>
            <div className='aktivne'>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 1</span>
                        <span className='opis'>Ovo je prva na popisu aktivnih konferencija</span>
                    </div>
                </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 2</span>
                        <span className='opis'>Ovo je druga na popisu aktivnih konferencija</span>
                    </div>
                </div>
                <div className='konferencija'>
                    <div className='konfImg'></div>
                    <div className='texts'>
                        <span className='naziv'>Konferencija 3</span>
                        <span className='opis'>Ovo je treca na popisu aktivnih konferencija</span>
                    </div>
                </div>
            <div/>
            <div className='nadolazece'>
            <p>Nadolazeće konferencije: </p>
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
        <div className='footer'>footer</div>
        </FallingAnimation>
        </>
    )
}

export default Konferencije;