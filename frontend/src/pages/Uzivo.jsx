import YouTube from "react-youtube";
import './Uzivo.css'

const Uzivo = () => {
    const opts = {
        height: '500px',
        width: '700px',
        playerVars: {
          autoplay: 1,
          controls: 1,
        }
    }
    const _onReady = (event) => {
        event.target.pauseVideo()
    }

    return (
        <>
        <div className="video">
            <YouTube className='lofigirl' videoId="lHpYyYtkmrw" opts={opts} onReady={_onReady}/>
        </div>
        </>
    )

}

export default Uzivo

{/* 
<iframe 
width="560" 
height="315" 
src="https://www.youtube.com/embed/lHpYyYtkmrw?si=hXzXiH0f3xOVzk2u" 
title="YouTube video player" 
frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
allowfullscreen>    
</iframe>
*/}

