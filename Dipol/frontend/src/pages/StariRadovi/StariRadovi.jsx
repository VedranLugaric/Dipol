import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StariRadovi.css';
import FallingAnimation from '../../FallingAnimation';
import { useNavigate  } from 'react-router-dom';

const StariRadovi = () => {
  const { id } = useParams();
  const [conferenceDetails, setConferenceDetails] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://dripol.onrender.com/api/past_conference/${id}`);
        const data = await response.json();
        setConferenceDetails(data);
      } catch (error) {
        console.error('Error fetching conference details:', error.message);
      }
    };

    fetchData();
  }, [id]);

  function getTopThreeVotes(conferenceDetails) {
    const radData = conferenceDetails.rad_data;
    const sortedRadData = radData.sort((a, b) => b.br_glasova - a.br_glasova);
    const topThree = sortedRadData.slice(0, 3);
  
    return topThree;
  }

  function getRemainingPlaces(conferenceDetails) {
    const radData = conferenceDetails.rad_data;
    const sortedRadData = radData.sort((a, b) => b.br_glasova - a.br_glasova);
    const remainingPlaces = sortedRadData.slice(3);
  
    return remainingPlaces;
  }


  return (
    <FallingAnimation>
      <hr></hr>
    <div className="container">
      <h2>Podaci o konferenciji</h2>
      <hr></hr>
      {conferenceDetails && (
        <div className="conference-details">
          <p className='conf-name'>Naziv konferencije: {conferenceDetails.conference.name}</p>
          <p className='conf-time'>Vrijeme početka: {conferenceDetails.conference.start_time}</p>
          <p className='conf-time'>Vrijeme završetka: {conferenceDetails.conference.end_time}</p>
          <div className='conf-button'>
              <button className='button' onClick={() => navigate(`/galerija/${conferenceDetails.conference.id}`)}>
                <span className='circle1'></span>
                <span className='circle2'></span>
                <span className='circle3'></span>
                <span className='circle4'></span>
                <span className='circle5'></span>
                <span className='text'>Galerija fotografija</span>
              </button>
            </div>
        

          {conferenceDetails.rad_data.length > 0 && (
            <div>
              <h3 className='conf-rang'>Rangirana ljestvica radova</h3>
              <hr className='rang'></hr>
              <div className='top-three-cont'>
                {getTopThreeVotes(conferenceDetails).map((rad, index) => (
                <>
                  <div className='top-three' key={index}>
                    <span className='place'>{index + 1}.mjesto</span>
                    <span className='rad-name'>{rad.naslov}</span>
                    <hr className='crta'></hr>
                    <span className='vote-count'>{rad.br_glasova}</span>
                    <span className='votes'>votes</span>
                    <hr className='crta2'></hr>
                    <span className='author-name'>{rad.ime_sudionika} {rad.prezime_sudionika}</span>
                  </div>
                </>
                ))}
              </div>
              <div className='remaining-cont'>
              {getRemainingPlaces(conferenceDetails).map((rad, index) => (
                <>
                  <div className='remaining-rad'>
                    <span className='rem-place'>{index + 4}.</span>
                    <span className='rad-name-r'>{rad.naslov} </span>
                    <span className='author-name-r'>{rad.ime_sudionika} {rad.prezime_sudionika}</span>
                    <span className='vote-count-r'>{rad.br_glasova} votes</span>
                  </div>
                </>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </FallingAnimation>
  );
};

export default StariRadovi;
