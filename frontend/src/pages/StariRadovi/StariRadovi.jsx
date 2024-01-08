import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StariRadovi.css';

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
    <div className="container">
      <h2>Conference Details</h2>
      {conferenceDetails && (
        <div className="conference-details">
          <p>Naziv konferencije: {conferenceDetails.conference.name}</p>
          <p>Vrijeme početka: {conferenceDetails.conference.start_time}</p>
          <p>Vrijeme završetka: {conferenceDetails.conference.end_time}</p>

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
  );
};

export default StariRadovi;
