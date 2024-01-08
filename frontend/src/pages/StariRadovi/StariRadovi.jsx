import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StariRadovi.css';
import FallingAnimation from '../../FallingAnimation';

const StariRadovi = () => {
  const { id } = useParams();
  const [conferenceDetails, setConferenceDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/past_conference/${id}`);
        const data = await response.json();
        setConferenceDetails(data);
      } catch (error) {
        console.error('Error fetching conference details:', error.message);
      }
    };

    fetchData();
  }, [id]);

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

          {conferenceDetails.rad_data.length > 0 && (
            <div>
              <h3>Rangirana ljestvica radova</h3>
              <ul className="radovi-list">
                {conferenceDetails.rad_data.map((rad, index) => (
                  <li key={index}>
                    <strong>{rad.naslov}</strong> - {rad.ime_sudionika} {rad.prezime_sudionika} - {rad.br_glasova} votes
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
    </FallingAnimation>
  );
};

export default StariRadovi;
