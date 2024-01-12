import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation'
import './Galerija.css'
import { saveAs } from 'file-saver'

const Galerija = () => {
  const { konferencijaId } = useParams();
  const [conferenceName, setConferenceName] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/galerija/${konferencijaId}`);
        const data = await response.json();
        setConferenceName(data.conference_name);
        setImages(data.pictures);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };

    fetchData();
  }, [konferencijaId]);

  const downloadImage = (link) => {
    try {
      saveAs(link, 'slika.png')
    } catch {

    }
    try {
      saveAs(link, 'slika.jpg')
    }
    catch {

    }
    try {
      saveAs(link, 'slika.jpeg')
    } 
    catch {

    }
  }

  return (
    <>
      <hr />
      <FallingAnimation>
        <h2 className='galerija'>Galerija konferencije '{conferenceName}'</h2>
        <div className='conf-button-galerija'></div>
        <div className='galerija-container'>
          {images.map((image, index) => (
            <div className='btn-foto-div'>
              <div className='fotografija' key={index}>
                <img className='foto' src={image} alt={`Slika ${index + 1}`} />
              </div>
              <a className='btn-a'>
                  <button className='download-button' onClick={() => downloadImage(image)}>Preuzmi</button>
                </a>
            </div>
          ))}
        </div>
      </FallingAnimation>
    </>
  );
};

export default Galerija;
