import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation'
import './Galerija.css'
import { saveAs } from 'file-saver'

const Galerija = () => {
  const { konferencijaId } = useParams();
  const [conferenceName, setConferenceName] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

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

  const downloadImage = async (url, index) => {
    const response = await fetch(`http://localhost:5000/downloadImage?url=${url}`);
    const blob = await response.blob();
    const timestamp = new Date().getTime();
    saveAs(blob, `slika_${timestamp}_${index}.png`);
  }
  
  const downloadSelectedImages = () => {
    selectedImages.forEach((image, index) => {
      downloadImage(image, index);
    });
  }  

  const toggleSelectImage = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(i => i !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  }

  return (
    <>
      <hr />
      <FallingAnimation>
        <h2 className='galerija'>Galerija konferencije '{conferenceName}'</h2>
        <div className='conf-button-galerija'>
        <button className='addkonf' onClick={downloadSelectedImages}>
            <span className="circle1"></span>
            <span className="circle2"></span>
            <span className="circle3"></span>
            <span className="circle4"></span>
            <span className="circle5"></span>
            <span className="text">Preuzmi odabrane fotografije</span>
          </button>
        </div>
        <div className='galerija-container'>
        {images.map((image, index) => (
          <div className='btn-foto-div' key={index}>
            <div
            onClick={() => toggleSelectImage(image)} 
            className={`fotografija ${selectedImages.includes(image) ? 'selected' : ''}`}>
              <img 
                className={`foto ${selectedImages.includes(image) ? 'selected' : ''}`} 
                src={image} 
                alt={`Slika ${index + 1}`} 
              />
              <input 
                type="checkbox" 
                checked={selectedImages.includes(image)} 
                onChange={() => toggleSelectImage(image)}
                className='checkbox-img' 
              />
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
