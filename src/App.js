import { useState, useEffect, useRef } from "react";
import axios from "axios";
import WeatherIcon from "./components/WeatherIcon";
import { MoonLoader } from "react-spinners";

import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import SearchIcon from "@mui/icons-material/Search";
import WaterIcon from "@mui/icons-material/Water";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import PlaceIcon from "@mui/icons-material/Place";

export default function App() {
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(null);
  const [time, setTime] = useState(null);
  const [tempmin, setTempmin] = useState(null);
  const [tempmax, setTempmax] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [feelslike, setFeelslike] = useState(null);
  const [stadt, setStadt] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const debounceTimeout = useRef(null);
  useEffect(() => {
    const fetchWeatherData = async () => {
      //[todo later] setLoading(true);
      const options = {
        method: "GET",
        params: {
          q: city,
          lang: "de",
        },
        url: `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=9bcec12c46c8ab1e6b9afbb3483a123a`,
      };
      setLoading(true);
      try {
        await axios
          .request(options)
          .then(function (response) {
            setErrorMessage(null);
            setTemp(response.data.main.temp);
            setTempmin(response.data.main.temp_min);
            setTempmax(response.data.main.temp_max);
            setHumidity(response.data.main.humidity);
            setFeelslike(response.data.main.feels_like);
            setStadt(response.data.name);
            setWeatherIcon(response.data.weather[0].icon);
            setDescription(response.data.weather[0].description);
            setFlag(response.data.sys.country);
            setWeatherData(response.data);
            setLoading(false);
          })
          .catch(function (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
              setErrorMessage("City not found.");
              setWeatherData();
              setLoading(false);
            } else if (error.response && error.response.status === 404) {
              setErrorMessage("City not found.");
              setWeatherData();
              setLoading(false);
            }
          });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage("City not found");
          setWeatherData();
        }
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (city) {
      debounceTimeout.current = setTimeout(() => {
        fetchWeatherData();
      }, 200);
    } else {
      setWeatherData();
    }
  }, [city]);

  return (
    <div className="container">
      <div className="navBar">
        <SearchIcon />
        <input
          value={city}
          onChange={handleCityChange}
          type="text"
          placeholder="e.g. Berlin ..."
        />
      </div>
      {loading && <MoonLoader color="#fff" speedMultiplier={1} />}
      {errorMessage && (
        <div style={{ margin: "auto", fontSize: "30px" }}>{errorMessage}</div>
      )}
      {weatherData && (
        <div className="weather-card">
          <div
            className="weather-details"
            style={{
              marginTop: "30px",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <span className="city-name">
              <PlaceIcon /> {stadt}
            </span>
            <span>
              <img
                src={`https://www.countryflagicons.com/FLAT/64/${flag}.png`}
                alt={flag}
              />
            </span>
          </div>

          <div className="city-name" style={{ fontSize: 80 }}>
            {Math.floor(temp)}°
          </div>
          <div className="weather-details">{description}</div>
          <div id="weatherIcon" className="weather-details">
            <WeatherIcon iconCode={weatherIcon} description={description} />
          </div>
          <div className="weather-details">
            <span>
              <SouthIcon />
            </span>
            <span>{Math.floor(tempmin)}°</span>
            <span>
              <NorthIcon />
            </span>
            <span>{Math.floor(tempmax)}°</span>
          </div>

          <div className="weather-details">
            <span>
              <DeviceThermostatIcon />
            </span>
            <span> {Math.floor(feelslike)}°</span>
            <span id="humidity">
              <WaterIcon />
            </span>
            <span>{humidity}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
