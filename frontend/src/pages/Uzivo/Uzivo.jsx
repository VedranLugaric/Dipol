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

/*const Footer = () =>{
    const [pokrovitelji, setPokrovitelj] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/pokrovitelj/${konferencijaId}`, {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            body: JSON.stringify({id_pokrovitelj: pokrovitelji.id}),
          });
  
          if (response.ok){
            const pokrovitelji = await response.json();
            setPokrovitelj(pokrovitelji);
          }
          else {
            console.error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Fetch error:', error.message);
        }
      };
      fetchData();
    }, []);
  
    return(
      <FallingAnimation>
        <hr>
        <footer>
          <ul>
            {pokrovitelji.map(pokrovitelj => (
              <li key={pokrovitelj.id}>{pokrovitelj.ime}</li>
            ))}
          </ul>
        </footer>
        </hr>
      </FallingAnimation>
    )
  
  } */

export default Uzivo
