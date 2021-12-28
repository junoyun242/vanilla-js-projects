const newCityNameBtn = document.querySelector(".new-city button");
const mainSelector = document.querySelector("main");
const weatherAPIKey = "4a80048ac273c6f7e70908e2bb631fee";

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=metric`
      );

      const weatherData = await data.json();
      displayWeather(weatherData);
    });
  } else {
    alert("Can't access your location");
  }
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
    newCityName.value = "";
  } catch (err) {
    console.log(err);
    error.innerHTML = `Can't find a city called ${newCityName}`;
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
  const iconCode = `<image src="http://openweathermap.org/img/wn/${icon}@2x.png"></image>`;
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
