import { useState, useEffect, useRef } from "react";
import axios from "axios";
import WeatherIcon from "./components/WeatherIcon";
import { MoonLoader } from "react-spinners";
import { BsSearch } from "react-icons/bs";
import { Button } from "@mui/material";
import { Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WaterIcon from "@mui/icons-material/Water";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";

export default function App() {
  const [city, setCity] = useState("");
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const [temp, setTemp] = useState(null);
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
          lang: "en",
        },
        url: `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${process.env.REACT_APP_API_KEY}`,
      };
      setLoading(true);
      try {
        await axios
          .request(options)
          .then(function (response) {
            setErrorMessage(null);
            console.log(response);
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
            console.log(weatherData);
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
      <div class="navBar">
        <SearchIcon />
        <input
          value={city}
          onChange={handleCityChange}
          type="text"
          placeholder="e.g. Berlin ..."
        />
      </div>
      {loading && <MoonLoader color="#36d7b7" speedMultiplier={1} />}
      {errorMessage && (
        <Alert style={{ margin: "auto", fontSize: "22px" }} severity="error">
          {errorMessage} !
        </Alert>
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
            <span style={{ color: "#fff", fontSize: "30px" }}>{stadt}</span>
            <span>
              <img
                src={`https://www.countryflagicons.com/FLAT/64/${flag}.png`}
                alt={flag}
              />
            </span>
          </div>
          <div style={{ fontSize: 80 }}>{Math.floor(temp)}°</div>
          <div id="weatherIcon" className="weather-details">
            <WeatherIcon iconCode={weatherIcon} description={description} />
          </div>
          <div className="weather-details">
            <span>
              <DeviceThermostatIcon />
            </span>
            <span> {Math.floor(feelslike)} °C</span>
          </div>
          <div className="weather-details">
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
