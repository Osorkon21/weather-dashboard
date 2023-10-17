// returned fields in weather api response

// cntA number of timestamps returned in the API response

// list
// list.dt Time of data forecasted, unix, UTC
// list.main
// list.main.temp Temperature.Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
// list.main.feels_like This temperature parameter accounts for the human perception of weather.Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
// list.main.temp_min Minimum temperature at the moment of calculation.This is minimal forecasted temperature(within large megalopolises and urban areas), use this parameter optionally.Please find more info here.Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
// list.main.temp_max Maximum temperature at the moment of calculation.This is maximal forecasted temperature(within large megalopolises and urban areas), use this parameter optionally.Please find more info here.Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
// list.main.pressure Atmospheric pressure on the sea level by default, hPa
// list.main.sea_level Atmospheric pressure on the sea level, hPa
// list.main.grnd_level Atmospheric pressure on the ground level, hPa
// list.main.humidity Humidity, %
//   list.main.temp_kf Internal parameter


// list.weather
// list.weather.id Weather condition id
// list.weather.main Group of weather parameters(Rain, Snow, Clouds etc.)
// list.weather.description Weather condition within the group.Please find more here.You can get the output in your language.Learn more
// list.weather.icon Weather icon id

// list.clouds
// list.clouds.all Cloudiness, %

//   list.wind
// list.wind.speed Wind speed.Unit Default: meter / sec, Metric: meter / sec, Imperial: miles / hour
// list.wind.deg Wind direction, degrees(meteorological)
// list.wind.gust Wind gust.Unit Default: meter / sec, Metric: meter / sec, Imperial: miles / hour
// list.visibility Average visibility, metres.The maximum value of the visibility is 10km

// list.pop Probability of precipitation.The values of the parameter vary between 0 and 1, where 0 is equal to 0 %, 1 is equal to 100 %

//   list.rain
// list.rain.3h Rain volume for last 3 hours, mm.Please note that only mm as units of measurement are available for this parameter

// list.snow
// list.snow.3h Snow volume for last 3 hours.Please note that only mm as units of measurement are available for this parameter

// list.sys
// list.sys.pod Part of the day(n - night, d - day)

// list.dt_txt Time of data forecasted, ISO, UTC

// city
// city.id City ID.Please note that built -in geocoder functionality has been deprecated.Learn more here
// city.name City name.Please note that built -in geocoder functionality has been deprecated.Learn more here
// city.coord
// city.coord.lat Geo location, latitude
// city.coord.lon Geo location, longitude
// city.country Country code(GB, JP etc.).Please note that built -in geocoder functionality has been deprecated.Learn more here
// city.population City population
// city.timezone Shift in seconds from UTC
// city.sunrise Sunrise time, Unix, UTC
// city.sunset Sunset time, Unix, UTC



// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
//   ```

// ## Acceptance Criteria

// ```
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5 - day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

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

// add searchHistory buttons here...

// don't forget to add below line if searchHistory contains something
// form.attr("class", "d-grid border-bottom border-white border-2");

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

  if (currentWeatherData.cod === "404") {
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
  $(".weather-icon-img").remove();

  const imgIcon = currentWeatherData.weather[0].icon;
  const newImg = $("<img>").attr("src", `https://openweathermap.org/img/wn/${imgIcon}.png`);
  newImg.attr("class", "weather-icon-img");

  todayForecast.attr("class", "today-forecast border border-white border-2 p-2");

  boldTodayForecast.text(currentWeatherData.name + dayjs().format(" (M/D/YYYY)"));
  boldTodayForecast.append(newImg);

  currentTemp.text(`Temp: ${Math.round(currentWeatherData.main.temp)}\xB0F`);
  currentWind.text(`Wind: ${Math.round(currentWeatherData.wind.speed)} MPH`);
  currentHumidity.text(`Humidity: ${currentWeatherData.main.humidity}%`);
}

function displayFiveDayForecast(cityForecastData) {
  fiveDayForecastHeadline.text("5-day forecast:");

  // erase previous 5 boxes... (remove all children of div)

  // display 5 boxes...
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
