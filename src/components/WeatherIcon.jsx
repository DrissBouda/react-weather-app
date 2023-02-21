import React from "react";
const WeatherIcon = ({ iconCode, description }) => {
  return (
    <div className="weather-icon">
      {/* <img
        width={200}
        src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
        alt={description}
      /> */}
      <img width={150} src={`/icons/${iconCode}.png`} alt={description} />
    </div>
  );
};

export default WeatherIcon;
