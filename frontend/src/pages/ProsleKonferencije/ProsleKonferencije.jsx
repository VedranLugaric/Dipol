import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProsleKonferencije = () => {
  const [conferences, setConferences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/past_conferences');
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

  return (
    <div>
      <h2>Past Conferences</h2>
      {conferences.map((conference) => (
        <div key={conference.id_konf}>
          <p>{conference.naziv}</p>
          <p>Vrijeme početka: {conference.vrijeme_poc}</p>
          <p>Vrijeme završetka: {conference.vrijeme_zav}</p>
          <button onClick={() => handleConferenceSelect(conference.id_konf)}>
            Pregledaj rezultate
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProsleKonferencije;
