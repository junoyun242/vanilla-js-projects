const newCityNameBtn = document.querySelector(".new-city button");
const mainSelector = document.querySelector("main");
const weatherAPIKey = "4a80048ac273c6f7e70908e2bb631fee";

const getLocation = () => {
  const failed = (err) => {
    console.log(err);
    alert("Can't access your location");
  };

  const success = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=metric`
    );

    const weatherData = await data.json();
    displayWeather(weatherData);
    displayAirQuality(weatherData.name);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, failed);
  } else {
    alert("Can't access your location");
  }
};

const displayAirQuality = async (cityName) => {
  const airQualityHeader = document.querySelector(".air-quality-header");
  const airQuality = document.querySelector(".air-quality");
  const levelElem = airQuality.querySelector(".level");
  const implicationsTitleElem = airQuality.querySelector(".implications-title");
  const implicationsElem = airQuality.querySelector(".implications");
  const statementTitleElem = airQuality.querySelector(".statement-title");
  const statementElem = airQuality.querySelector(".statement");

  const url = `https://api.waqi.info/feed/${cityName}/?token=cb5abaddb2e7478acc2ed564389240f7c094afdd`;

  const data = await fetch(url);
  const airQualityData = await data.json();
  const aqi = airQualityData.data.aqi;
  let airPollutionLevel;
  let healthImplications;
  let cautionaryStatement;
  let bgColor;

  if (aqi <= 50) {
    airPollutionLevel = "Good";
    healthImplications =
      "Air quality is considered satisfactory, and air pollution poses little or no risk";
    cautionaryStatement = "None";
    bgColor = "#019966";
  } else if (aqi <= 100 && aqi >= 51) {
    airPollutionLevel = "Moderate";
    healthImplications =
      "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.";
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
    bgColor = "#FFDE33";
    airQuality.style.color = "black";
  } else if (aqi <= 150 && aqi >= 101) {
    airPollutionLevel = "Unhealthy for Sensitive Groups";
    healthImplications =
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
    bgColor = "#FF9933";
    airQuality.style.color = "black";
  } else if (aqi <= 200 && aqi >= 151) {
    airPollutionLevel = "Unhealthy";
    healthImplications =
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects";
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion";
    bgColor = "#D63059";
  } else if (aqi <= 300 && aqi >= 201) {
    airPollutionLevel = "Very Unhealthy";
    healthImplications =
      "Health warnings of emergency conditions. The entire population is more likely to be affected.";
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.";

    bgColor = "#661E99";
  } else {
    airPollutionLevel = "Hazardous";
    healthImplications =
      "Health alert: everyone may experience more serious health effects";
    cautionaryStatement = "Everyone should avoid all outdoor exertion";
    bgColor = "#7E0E23";
  }

  airQualityHeader.innerHTML = "Air Quality";
  airQuality.style.backgroundColor = bgColor;

  levelElem.innerHTML = `${airPollutionLevel} ( ${aqi} )`;
  implicationsTitleElem.innerHTML = "Health Implications";
  implicationsElem.innerHTML = `${healthImplications}`;
  statementTitleElem.innerHTML = "Cautionary Statement (for PM2.5)";
  statementElem.innerHTML = cautionaryStatement;
};

const searchCity = async (e) => {
  e.preventDefault();
  const newCityName = document.querySelector(".new-city input");
  const error = document.querySelector(".error");

  try {
    error.innerHTML = "";
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${newCityName.value}&appid=${weatherAPIKey}&units=metric`
    );

    const weatherData = await data.json();
    displayWeather(weatherData);
    displayAirQuality(weatherData.name);
    newCityName.value = "";
  } catch (err) {
    console.log(err);
    error.innerHTML = `Can't find a city called ${newCityName.value}`;
  }
};

const displayWeather = (weather) => {
  const displayWeather = document.querySelector(".display-weather");
  const cityName = document.querySelector(".city-name");
  const generalDescription = document.querySelector(".weather-description");
  const tempMin = document.querySelector(".temp-min");
  const tempMax = document.querySelector(".temp-max");
  const feelsLike = document.querySelector(".feels-like");

  const nameOfCity = weather.name;
  const { main, description, icon, id } = weather.weather[0];
  const weatherMain = weather.main;
  const iconCode = `<image src="https://openweathermap.org/img/wn/${icon}@2x.png"></image>`;
  cityName.innerHTML =
    nameOfCity + " " + iconCode + Math.round(weatherMain.temp) + "℃";
  generalDescription.innerHTML = `Weather: ${main} (${description})`;
  tempMin.innerHTML = "Min: " + Math.round(weatherMain.temp_min) + "℃";
  tempMax.innerHTML = "Max: " + Math.round(weatherMain.temp_max) + "℃";
  feelsLike.innerHTML =
    "Feels like: " + Math.round(weatherMain.feels_like) + "℃";

  let background;

  const weatherId = String(id);

  switch (Number(weatherId[0])) {
    case 2:
      background = "#828282";
      break;
    case 3:
      background = "#4f32d1";
      break;
    case 5:
      background = "#4f32d1";
      break;
    case 6:
      background = "#d3cfcf";
      displayWeather.style.color = "black";
      break;
    case 7:
      background = "#b75422";
      break;
    case 8:
      if (id === 800) {
        background = "#3fb3fc";
      } else {
        background = "#608399";
      }
      break;
    default:
      break;
  }

  mainSelector.style.backgroundColor = background;
};

getLocation();

newCityNameBtn.addEventListener("click", searchCity);
