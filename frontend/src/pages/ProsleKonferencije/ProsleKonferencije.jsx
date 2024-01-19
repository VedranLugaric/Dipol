import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProsleKonferencije.css'
import { format } from 'date-fns';
import FallingAnimation from '../../FallingAnimation';

const ProsleKonferencije = () => {
  const [conferences, setConferences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dripol.onrender.com/api/past_conferences');
        const data = await response.json();
        setConferences(data.conferences);
      } catch (error) {
        console.error('Error fetching conferences:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleConferenceSelect = (konferencijaId) => {
    navigate(`/stariradovi/${konferencijaId}`);
  };

  const formatDate = (date) => {
    var datum = new Date(date)
    return format(datum, "MMMM do, yyyy H:mm")
  }
  

  return (
    <FallingAnimation>
    <div>
      <hr></hr>
      <p className='header'>Provedene konferencije:</p>
      <div className='conference-container'>
        {conferences.map((conference) => (
          <div className='conference' key={conference.id_konf}>
            <div className='text-containers'>
              <span className='conf-name'>{conference.naziv}</span>
              <span className='conf-time'>Vrijeme početka: {formatDate(conference.vrijeme_poc)} GMT</span>
              <span className='conf-time'>Vrijeme završetka: {formatDate(conference.vrijeme_zav)} GMT</span>
            </div>
            <div className='conf-button'>
              <button className='button' onClick={() => handleConferenceSelect(conference.id_konf)}>
                <span className='circle1'></span>
                <span className='circle2'></span>
                <span className='circle3'></span>
                <span className='circle4'></span>
                <span className='circle5'></span>
                <span className='text'>Pregledaj rezultate</span>
              </button>
            </div>
          </div>
      ))}
      </div>
    </div>
    </FallingAnimation>
  );
};

export default ProsleKonferencije;
