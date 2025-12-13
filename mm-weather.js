var fromLat = process.env.FROM_LAT || process.env.MM_LAT;
var fromLong = process.env.FROM_LON || process.env.MM_LON;
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWeatherData(latitude, longitude) {
  const pointsUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
  try {
    let response = await fetch(pointsUrl);
    if (!response.ok) {
        var error = { 
            response: "Could not fetch weather data"
          }
          console.log(JSON.stringify(error));
    }
    const data = await response.json();
    const forecastUrl = data.properties.forecast;
    var aprox = data.properties.relativeLocation.properties.city;
    response = await fetch(forecastUrl);
    if (!response.ok) {
          var error = { 
            response: "Could not fetch weather data"
          }
          console.log(JSON.stringify(error));
    }
    const forecastData = await response.json();
    const currentPeriod = forecastData.properties.periods[0];
    const ack = {
        response: `🏙️ - ${aprox}\n🌡️ - Temperature: ${currentPeriod.temperature}°F\n📊 - Forecast: ${currentPeriod.detailedForecast}`
    };
    delay(3000);
    console.log(JSON.stringify(ack))

  } catch (error) {
        var error = { 
            response: "Could not fetch weather data"
          }
        console.log(JSON.stringify(error));
  }
}

fetchWeatherData(fromLat,fromLong);