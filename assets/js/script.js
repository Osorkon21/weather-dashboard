const body = $("body");
const form = $("form");
const cityNameInput = $("#city-name-input");
const savedCityBtns = $(".saved-city-buttons");
const todayForecast = $(".today-forecast");
const boldTodayForecast = $(".bold-today-forecast");
const currentTemp = $(".current-temp");
const currentWind = $(".current-wind");
const currentHumidity = $(".current-humidity");
const fiveDayForecastHeadline = $(".five-day-forecast-headline");
const fiveDayForecastContainer = $(".five-day-forecast-container");

var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

start();

function start() {
  if (searchHistory.length !== 0)
    for (var i = 0; i < searchHistory.length; i++)
      genSearchHistoryBtn(searchHistory[i]);
}

function onCityNameInput(e) {
  e.preventDefault();
  var cityName = formatCityName(cityNameInput.val());
  displayWeather(cityName);
}

function onSavedCityClick() {
  displayWeather($(this).text(), false);
}

function formatCityName(cityName) {
  var trimmedName = cityName.trim();
  var splitName = trimmedName.split(" ");
  var capitalizedName = "";

  for (var i = 0; i < splitName.length; i++) {
    var firstLetter = splitName[i][0];
    var restOfWord = splitName[i].slice(1);

    if (firstLetter === undefined)
      continue;

    var word = (firstLetter.toUpperCase() + restOfWord.toLowerCase());
    capitalizedName += word;

    if (i !== splitName.length - 1)
      capitalizedName += " ";
  }

  // edge case
  if (capitalizedName === "Washington D.c.")
    capitalizedName = "Washington D.C.";

  return capitalizedName;
}

async function displayWeather(cityName, saveHistory = true) {
  const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${convertSpaces(cityName)}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial`;

  const currentWeatherResponse = await fetch(currentWeatherAPI);
  const currentWeatherData = await currentWeatherResponse.json();

  if (currentWeatherData.cod === "404" || currentWeatherData.cod === "400") {
    changeCityNameInput(true);
    return;
  }
  else {
    changeCityNameInput(false);

    if (saveHistory && !isNameAlreadySaved(cityName)) {
      saveSearchHistory(cityName);
      genSearchHistoryBtn(cityName);
    }
  }

  displayCurrentWeather(currentWeatherData);

  const lat = currentWeatherData.coord.lat;
  const lon = currentWeatherData.coord.lon;

  const cityAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial`;

  const cityResponse = await fetch(cityAPI);
  const cityForecastData = await cityResponse.json();

  console.log(cityForecastData);

  displayFiveDayForecast(cityForecastData);
}

function convertSpaces(cityName) {
  for (var i = 0; i < cityName.length; i++)
    if (cityName[i] === " ")
      cityName[i] = "+";

  return cityName;
}

function changeCityNameInput(cityNotFound) {
  if (cityNotFound) {
    cityNameInput.val("");
    cityNameInput.attr("placeholder", "City not found! Try again.");
  }
  else {
    cityNameInput.val("");
    cityNameInput.attr("placeholder", "city name");
  }
}

function isNameAlreadySaved(cityName) {
  for (var i = 0; i < searchHistory.length; i++)
    if (cityName === searchHistory[i])
      return true;

  return false;
}

function displayCurrentWeather(currentWeatherData) {
  const imgIcon = currentWeatherData.weather[0].icon;
  const newImg = $("<img>").attr("src", `https://openweathermap.org/img/wn/${imgIcon}.png`);

  todayForecast.attr("class", "today-forecast border border-white border-2 p-2");

  boldTodayForecast.text(currentWeatherData.name + dayjs().format(" (M/D/YYYY)"));
  boldTodayForecast.append(newImg);

  currentTemp.text(`Temp: ${Math.round(currentWeatherData.main.temp)}\xB0F`);
  currentWind.text(`Wind: ${Math.round(currentWeatherData.wind.speed)} MPH`);
  currentHumidity.text(`Humidity: ${currentWeatherData.main.humidity}%`);
}

function displayFiveDayForecast(cityForecastData) {
  fiveDayForecastHeadline.text("5-Day Forecast:");
  fiveDayForecastContainer.empty();

  for (var i = 0; i < 5; i++) {
    const weather = cityForecastData.list[8 * i];
    const date = dayjs(weather.dt_txt).format("M/D/YYYY");
    const imgIcon = weather.weather[0].icon;
    const temp = `Temp: ${Math.round(weather.main.temp)}\xB0F`;
    const wind = `Wind: ${Math.round(weather.wind.speed)} MPH`;
    const humidity = `Humidity: ${weather.main.humidity}%`;

    fiveDayForecastContainer.append($(`
      <div class="border border-white border-2 p-2">
        <p class="h3">${date}</p>
        <img src="https://openweathermap.org/img/wn/${imgIcon}.png">
        <p>${temp}</p>
        <p>${wind}</p>
        <p>${humidity}</p>
      </div>
    `));
  }
}

function saveSearchHistory(cityName) {
  searchHistory.push(cityName);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function genSearchHistoryBtn(cityName) {
  savedCityBtns.append(`
  <button type="button" class="saved-city btn-outline-secondary bg-gradient">${cityName}</button>`);

  form.attr("class", "d-grid border-bottom border-white border-2");
}

body.on("click", ".search-btn", onCityNameInput);
body.on("click", ".saved-city", onSavedCityClick);
