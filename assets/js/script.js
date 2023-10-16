// api key: fe0219a594b50b6a018a708bc7c62289



// openweatherapi call

// api call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial

// parameters of openweather api call

// lat	required	Latitude.If you need the geocoder to automatic convert city names and zip - codes to geo coordinates and the other way around, please use our Geocoding API

// lon	required	Longitude.If you need the geocoder to automatic convert city names and zip - codes to geo coordinates and the other way around, please use our Geocoding API

// appid	required	Your unique API key(you can always find it on your account page under the "API key" tab)

// units	optional	Units of measurement.standard, metric and imperial units are available.If you do not use the units parameter, standard units will be applied by default. Learn more

// mode	optional	Response format.JSON format is used by default. To get data in XML format use mode = xml.Learn more

// cnt	optional	A number of timestamps, which will be returned in the API response.Learn more

// units	optional	Units of measurement.standard, metric and imperial units are available.If you do not use the units parameter, standard units will be applied by default. Learn more

// lang	optional	You can use the lang parameter to get the output in your language.Learn more



// returned fields in weather api response

// cod Internal parameter

// message Internal parameter

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


// geolocation api call

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=fe0219a594b50b6a018a708bc7c62289

// parameters of openweather geolocation api call

// q	required	City name, state code(only for the US) and country code divided by comma.Please use ISO 3166 country codes.

// appid	required	Your unique API key(you can always find it on your account page under the "API key" tab)

// limit	optional	Number of the locations in the API response(up to 5 results can be returned in the API response)



// returned fields in GEO api response

// zip Specified zip / post code in the API request

// name Name of the found area

// lat Geographical coordinates of the centroid of found zip / post code(latitude)

// lon Geographical coordinates of the centroid of found zip / post code(longitude)

// country Country of the found zip / post code



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
const cityNameInput = $("#city-name-input");
const citySearchContainer = $(".city-search-container");
const searchBtn = $(".search-btn");

body.on("click", ".search-btn", onCityNameInput);

function onCityNameInput(e) {
  e.preventDefault();
  var cityName = cityNameInput.val();
  displayCityWeather(cityName);
}

async function displayCityWeather(cityName) {
  const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${convertSpaces(cityName)}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial`;

  var currentWeatherResponse = await fetch(currentWeatherAPI);
  const currentWeatherData = await currentWeatherResponse.json();

  console.log(currentWeatherData);

  const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${convertSpaces(cityName)}&appid=fe0219a594b50b6a018a708bc7c62289`;

  const geoResponse = await fetch(geoAPI);
  const geoData = await geoResponse.json();

  if (geoData.length === 0) {
    cityNameInput.val("");
    cityNameInput.attr("placeholder", "City not found! Try again.");
    return;
  }
  else {
    cityNameInput.val("");
    cityNameInput.attr("placeholder", "city name");
  }

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;

  const cityAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fe0219a594b50b6a018a708bc7c62289&units=imperial`;

  const cityResponse = await fetch(cityAPI);
  const cityForecastData = await cityResponse.json();

  console.log(cityForecastData);
}

function convertSpaces(cityName) {
  for (var i = 0; i < cityName.length; i++)
    if (cityName[i] === " ")
      cityName[i] = "+";

  return cityName;
}

function addMovieCard(data) {
  var ratingsArr = data.Ratings;
  var rotTomRating = "";
  var posterURL = data.Poster !== "N/A" ? data.Poster : "";

  for (var i = 0; i < ratingsArr.length; i++) {
    if (ratingsArr[i].Source === "Rotten Tomatoes")
      rotTomRating = ratingsArr[i].Value;
  }

  citySearchContainer.append($(`
  <div class="card d-flex" style="width: 20rem;">
    <img class="card-img-top" src="${posterURL}" alt="No poster found!">
    <div class="card-body">
      <h5 class="card-title">${data.Title}</h5>
      <ul>
        <li>Plot: ${data.Plot}</li>
        <li>Year: ${data.Year}</li>
        <li>Runtime: ${data.Runtime}</li>
        <li>Starring: ${data.Actors}</li>
        <li>Rotten Tomatoes: ${(rotTomRating ? rotTomRating : "N/A")}</li>
      </ul>
      <a href="#" class="btn btn-primary">Add to Cart</a>
    </div>
  </div>`));
}
