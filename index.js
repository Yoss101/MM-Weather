var fromLat = process.env.FROM_LAT || process.env.MM_LAT;
var fromLong = process.env.FROM_LON || process.env.MM_LON;

async function fetchWeatherData(latitude, longitude) {
  const pointsUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
  const headers = { 'User-Agent': 'MeshMonitor-Weather' };

  try {
    const pointsRes = await fetch(pointsUrl, { headers });
    if (!pointsRes.ok) throw new Error();
    const pointsData = await pointsRes.json();

    const hourlyUrl = pointsData.properties.forecastHourly;
    const dailyUrl = pointsData.properties.forecast;
    const city = pointsData.properties.relativeLocation.properties.city;

    const [dailyRes, hourlyRes] = await Promise.all([
      fetch(dailyUrl, { headers }),
      fetch(hourlyUrl, { headers })
    ]);

    if (!dailyRes.ok || !hourlyRes.ok) throw new Error();

    const dailyData = await dailyRes.json();
    const hourlyData = await hourlyRes.json();

    const currentPeriod = dailyData.properties.periods[0];
    const currentTemp = hourlyData.properties.periods[0].temperature;

    const ack = {
      response: `🏙️ - ${city}\n🌡️ - Temperature: ${currentTemp}°F\n📊 - Forecast: ${currentPeriod.detailedForecast}`
    };
    console.log(JSON.stringify(ack));

  } catch (error) {
    console.log(JSON.stringify({ response: "Could not fetch weather data" }));
  }
}

fetchWeatherData(fromLat, fromLong);
