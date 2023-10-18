// add comments
// README
// submit

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

// loads city search history
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

start();

// add buttons for city names loaded from search history
function start() {
  if (searchHistory.length !== 0)
    for (var i = 0; i < searchHistory.length; i++)
      genSearchHistoryBtn(searchHistory[i]);
}

// Search button event handler
function onCityNameInput(e) {
  e.preventDefault();
  var cityName = formatCityName(cityNameInput.val());
  displayWeather(cityName);
}

// reloads weather info
function onSavedCityClick() {
  displayWeather($(this).text(), false);
}

// capitalizes first letter, lowercases the rest, ignores extra spaces
function formatCityName(cityName) {
  var trimmedName = cityName.trim();
  var splitName = trimmedName.split(" ");
  var capitalizedName = "";

  for (var i = 0; i < splitName.length; i++) {
    var firstLetter = splitName[i][0];
    var restOfWord = splitName[i].slice(1);

    // check for empty strings
    if (firstLetter === undefined)
      continue;

    var word = (firstLetter.toUpperCase() + restOfWord.toLowerCase());
    capitalizedName += word;

    // don't add an extra space at the end of the word
    if (i !== splitName.length - 1)
      capitalizedName += " ";
  }

  // handle edge case
  if (capitalizedName === "Washington D.c.")
    capitalizedName = "Washington D.C.";

  return capitalizedName;
}

// API query function, displays resulting API data
async function displayWeather(cityName, saveHistory = true) {
  const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${convertSpaces(cityName)}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial`;

  const currentWeatherResponse = await fetch(currentWeatherAPI);
  const currentWeatherData = await currentWeatherResponse.json();

  // don't process bad data
  if (currentWeatherData.cod === "404" || currentWeatherData.cod === "400") {
    changeCityNameInput(true);
    return;
  }
  else {
    changeCityNameInput(false);

    // only save if city name is new
    if (saveHistory && !isNameAlreadySaved(cityName)) {
      saveSearchHistory(cityName);
      genSearchHistoryBtn(cityName);
    }
  }

  displayCurrentWeather(currentWeatherData);

  // latitude
  const lat = currentWeatherData.coord.lat;

  // longitude
  const lon = currentWeatherData.coord.lon;

  const cityAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial`;

  const cityResponse = await fetch(cityAPI);
  const cityForecastData = await cityResponse.json();

  console.log(cityForecastData);

  displayFiveDayForecast(cityForecastData);
}

// replaces all spaces in URL queries with plus signs
function convertSpaces(cityName) {
  for (var i = 0; i < cityName.length; i++)
    if (cityName[i] === " ")
      cityName[i] = "+";

  return cityName;
}

// resets search box contents
function changeCityNameInput(cityNotFound) {
  if (cityNotFound) {
    cityNameInput.val("");

    // error message if bad city name passed
    cityNameInput.attr("placeholder", "City not found! Try again.");
  }
  else {
    cityNameInput.val("");
    cityNameInput.attr("placeholder", "city name");
  }
}

// did user already search for this city
function isNameAlreadySaved(cityName) {
  for (var i = 0; i < searchHistory.length; i++)
    if (cityName === searchHistory[i])
      return true;

  return false;
}

// populates top right box with current weather conditions
function displayCurrentWeather(currentWeatherData) {

  // image icon name
  const imgIcon = currentWeatherData.weather[0].icon;

  const newImg = $("<img>").attr("src", `https://openweathermap.org/img/wn/${imgIcon}.png`);

  // adds border around current weather conditions box
  todayForecast.attr("class", "today-forecast border border-white border-2 p-2");

  // adds date
  boldTodayForecast.text(currentWeatherData.name + dayjs().format(" (M/D/YYYY)"));
  boldTodayForecast.append(newImg);

  // adds current weather
  currentTemp.text(`Temp: ${Math.round(currentWeatherData.main.temp)}\xB0F`);
  currentWind.text(`Wind: ${Math.round(currentWeatherData.wind.speed)} MPH`);
  currentHumidity.text(`Humidity: ${currentWeatherData.main.humidity}%`);
}

// populates bottom right boxes with forecasted weather conditions
function displayFiveDayForecast(cityForecastData) {
  fiveDayForecastHeadline.text("5-Day Forecast:");

  // deletes any previous forecast boxes
  fiveDayForecastContainer.empty();

  // build 5 boxes
  for (var i = 0; i < 5; i++) {

    // gather weather conditions
    const weather = cityForecastData.list[8 * i];
    const date = dayjs(weather.dt_txt).format("M/D/YYYY");
    const imgIcon = weather.weather[0].icon;
    const temp = `Temp: ${Math.round(weather.main.temp)}\xB0F`;
    const wind = `Wind: ${Math.round(weather.wind.speed)} MPH`;
    const humidity = `Humidity: ${weather.main.humidity}%`;

    // add box as raw HTML
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

// saves search history in localStorage
function saveSearchHistory(cityName) {
  searchHistory.push(cityName);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// adds searched-for city name to a new button
function genSearchHistoryBtn(cityName) {
  savedCityBtns.append(`
  <button type="button" class="saved-city btn-outline-secondary bg-gradient">${cityName}</button>`);

  // adds border below Search button
  form.attr("class", "d-grid border-bottom border-white border-2");
}

// event handlers for buttons
body.on("click", ".search-btn", onCityNameInput);
body.on("click", ".saved-city", onSavedCityClick);
