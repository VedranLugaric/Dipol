import YouTube from "react-youtube";
import './Uzivo.css'
import FallingAnimation from '../../FallingAnimation';

const Uzivo = () => {
    //ovaj src se treba zamijeniti src-om iz baze
    const src = "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
    
    return (
        <FallingAnimation>
            <hr></hr>
            <div className="video">
            <video controls width="100%">
                <source src={src} type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
                </video>
            </div>
        </FallingAnimation>
    )

}

export default Uzivo
