import FallingAnimation from '../../FallingAnimation'
import './Poster.css'

const Poster = () => {
    const preth = '<'
    const sljed = '>'
    return (
        <>
        <FallingAnimation>
            <hr></hr>
            <div className='postercontainer'>
                <div className='poster-left'>
                </div>
                <div className='poster-middle'>
                </div>
                <div className='poster-right'>
                </div>
            </div>
            <hr></hr>
            <div className='contents'>
                <button className='prev'>{preth}</button>
                <span className='posternaziv'>Trenutni poster: Naziv</span>
                <button className='next'>{sljed}</button>
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
        </FallingAnimation>
        </>
    )
}

export default Poster