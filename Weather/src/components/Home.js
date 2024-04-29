import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';

const Home = () => {
  const [cityName, setCityName] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [weatherData, setWeatherData] = useState({
    temp: '',
    minTemp: '',
    maxTemp: '',
    humidity: '',
    condition: '',
    windSpeed: '',
    windDirection: '',
    weatherIcon: '',
    forecast: [],
  });
  const [error, setError] = useState("Enter city");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '93f0158fa9047f94d48e22a6b042d3d0';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`
        );
        const data = await response.json();
  
        if (response.ok) {
          setWeatherData((prevData) => ({
            ...prevData,
            temp: `${data.main.temp} °${unit === 'metric' ? 'C' : 'F'}`,
            minTemp: `${data.main.temp_min} °${unit === 'metric' ? 'C' : 'F'}`,
            maxTemp: `${data.main.temp_max} °${unit === 'metric' ? 'C' : 'F'}`,
            humidity: `${data.main.humidity}%`,
            condition: data.weather[0].description,
            windSpeed: `${data.wind.speed} m/s`,
            windDirection: `${data.wind.deg}°`,
            weatherIcon: data.weather[0].icon,
          }));
          setError('');
        } else {
          setError('City not found. Please enter a valid city name.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while fetching weather data. Please try again.');
      }
    };
  
    if (cityName) {
      fetchWeatherData();
    }
  }, [cityName, unit, setWeatherData]);
  

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const apiKey = '93f0158fa9047f94d48e22a6b042d3d0';
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`
        );
        const forecastData = await forecastResponse.json();
  
        if (forecastResponse.ok) {
          const dailyForecast = forecastData.list.filter((item) =>
            item.dt_txt.includes('12:00:00')
          );
  
          const formattedForecast = dailyForecast.map((item) => ({
            date: item.dt_txt.split(' ')[0],
            avgTemp: `${item.main.temp} °${unit === 'metric' ? 'C' : 'F'}`,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          }));
  
          // Use the setWeatherData callback form to ensure access to the latest state
          setWeatherData((prevData) => ({
            ...prevData,
            forecast: formattedForecast,
          }));
          setError('');
        } else {
          setError('Forecast data not available for the selected city.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while fetching forecast data. Please try again.');
      }
    };
  
    if (cityName) {
      fetchForecastData();
    }
  }, [cityName, unit, setWeatherData]);
  

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className='container'>
      <div className='weather'>
        <div className='search'>
          <input
            type='text'
            placeholder='Enter The City Name'
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
        </div>
          {/* <button onClick={toggleUnit}>Search</button> */}
          <div className="unit-converter">
    <span> Unit Toggle Convert °C to °F</span>
    <input type="checkbox" onChange={toggleUnit} />
  </div>
          
        {error && <p className='error'>{error}</p>}
        <div className='weather-cards'>
          <div className='card'>
            <h3>Temperature</h3>
            <p>{weatherData.temp}</p>
          </div>
          <div className='card'>
            <h3>Min Temperature</h3>
            <p>{weatherData.minTemp}</p>
          </div>
          <div className='card'>
            <h3>Max Temperature</h3>
            <p>{weatherData.maxTemp}</p>
          </div>
          <div className='card'>
            <h3>Humidity</h3>
            <p>{weatherData.humidity}</p>
          </div>
          <div className='card'>
            <h3>Condition</h3>
            <p>{weatherData.condition}</p>
          </div>
          <div className='card'>
            <h3>Wind Speed</h3>
            <p>{weatherData.windSpeed}</p>
          </div>
          <div className='card'>
            <h3>Wind Direction</h3>
            <p>{weatherData.windDirection}</p>
          </div>
          <div className='card'>
            <img
              src={`https://openweathermap.org/img/w/${weatherData.weatherIcon}.png`}
              alt={`Weather icon for ${weatherData.condition}`}
            />
          </div>
        </div>
          <h2>5-Day Forecast</h2>
        {!error && <div className='forecast'>
          <Slider {...settings}>
            {weatherData.forecast.map((day) => (
              <div className='forecast-card' key={day.date}>
                <p>{day.date}</p>
                <p>{day.avgTemp}</p>
                <p>{day.description}</p>
                <img
                  src={`https://openweathermap.org/img/w/${day.icon}.png`}
                  alt={`Weather icon for ${day.description}`}
                />
              </div>
            ))}
          </Slider>
        </div>}
      </div>
    </div>
  );
};

export default Home;
