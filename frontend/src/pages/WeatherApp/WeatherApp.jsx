import { Oval } from 'react-loader-spinner'; 
import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFrown } from '@fortawesome/free-solid-svg-icons'; 
import './WeatherApp.css'; 

const GfGWeatherApp = (props) => {
	const [weather, setWeather] = useState({ 
		loading: true, 
		data: {}, 
		error: false, 
	}); 

	const toDateFunction = () => { 
		const months = [ 
			'January', 
			'February', 
			'March', 
			'April', 
			'May', 
			'June', 
			'July', 
			'August', 
			'September', 
			'October', 
			'November', 
			'December', 
		]; 
		const WeekDays = [ 
			'Sunday', 
			'Monday', 
			'Tuesday', 
			'Wednesday', 
			'Thursday', 
			'Friday', 
			'Saturday', 
		]; 
		const currentDate = new Date(); 
		const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`; 
		return date; 
	}; 

	const fetchWeather = async (city) => {
		const url = 'https://api.openweathermap.org/data/2.5/weather'; 
		const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; 

		try {
			const response = await axios.get(url, { 
				params: { 
					q: city, // Set city to Zagreb
					units: 'metric', 
					appid: api_key, 
				}, 
			});
			setWeather({ data: response.data, loading: false, error: false });
		} catch (error) {
			setWeather({ data: {}, loading: false, error: true });
			console.log('error', error);
		}
	};

	useEffect(() => {
		fetchWeather(props.grad);
	}, []); // Fetch weather data on initial render

	return ( 
		<div className="App"> 
			{weather.loading && ( 
				<> 
					<br /> 
					<br /> 
					<Oval type="Oval" color="black" height={100} width={100} /> 
				</> 
			)} 
			{weather.error && ( 
				<> 
					<br /> 
					<br /> 
					<span className="error-message"> 
						<FontAwesomeIcon icon={faFrown} /> 
						<span style={{ fontSize: '20px' }}>City not found</span> 
					</span> 
				</> 
			)} 
			{weather && weather.data && weather.data.main && ( 
				<div>
					<div className='temp-container'> 
						<div className="icon-temp"> 
							<img 
								className="icon"
								src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
								alt={weather.data.weather[0].description} 
							/>
							<div className='num-deg'> 
								<sup className='num'>{Math.round(weather.data.main.temp)} </sup>
								<sup className="deg">°C</sup> 
							</div>
						</div> 
						<div className="des-wind"> 
							<p className='text'>{weather.data.weather[0].description.toUpperCase()}</p> 
							<p className='text'>Wind Speed: {weather.data.wind.speed}m/s</p> 
						</div>
						
					</div>
				</div> 
			)} 
		</div> 
	); 
} 

export default GfGWeatherApp;
