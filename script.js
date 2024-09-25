// Function to get day name from number
function getDayName(num) {
  switch (num) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return '';
  }
}

// Selected HTML elements
const temperatureField = document.querySelector('.temp');
const cityField = document.querySelector('.time_location p');
const dateField = document.querySelector('.time_location span');
const emojiField = document.querySelector('.weather_condition img');
const weatherField = document.querySelector('.weather_condition span');
const form = document.querySelector('form');
const searchField = document.querySelector('.searchField');
const forecastContainer = document.querySelector('.forecast-container'); // For forecast

// on form submit, get input value and pass to API.
form.addEventListener('submit', handleSearch);

function handleSearch(ev) {
  ev.preventDefault(); // don't handle the event (form submission) the way you do.
  
  const target = searchField.value.trim(); // Get and trim the input value
  if (target) { // Check if input is not empty
    getData(target); // Fetch data for the entered city
    searchField.value = ""; // Clear the input field
  } else {
    alert('Please enter a city name'); // Alert if input is empty
  }
}

// Function to update the DOM with current weather data
function updateCurrentWeather(locationName, localTime, temp, conditionName, conditionEmoji) {
  const exactDate = localTime.split(' ')[0];
  const exactTime = localTime.split(' ')[1];
  const dayNumber = new Date(localTime).getDay();
  const exactDay = getDayName(dayNumber);

  temperatureField.innerText = temp;
  cityField.innerText = locationName;
  dateField.innerText = `${exactTime} - ${exactDay} - ${exactDate}`;
  emojiField.src = conditionEmoji;
  weatherField.innerText = conditionName;
}

// Function to update the DOM with forecast data, excluding today's weather
function updateForecast(forecast) {
  forecastContainer.innerHTML = ''; // Clear previous forecast data

  // Start from index 1 to skip the current day
  for (let i = 1; i < forecast.length; i++) {
      const day = forecast[i]; // Get the next day's forecast
      const dayNumber = new Date(day.date).getDay();
      const dayName = getDayName(dayNumber);
      const forecastHTML = `
          <div class="forecast-day">
              <h3>${dayName}</h3>
              <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p>${day.day.condition.text}</p>
              <p>Max: ${day.day.maxtemp_c}°C / Min: ${day.day.mintemp_c}°C</p>
          </div>
      `;
      forecastContainer.innerHTML += forecastHTML; // Append forecast data to container
  }
}

// Keep your original async function structure
async function getData(target) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=97ba317e19cd4d6293624853241209&q=${target}&days=4&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Current weather data
    const locationName = data.location.name;
    const localTime = data.location.localtime; // '2024-09-12 09:15'
    const temp = data.current.temp_c;
    const conditionName = data.current.condition.text;
    const conditionEmoji = data.current.condition.icon;

    // Forecast data
    const forecastDays = data.forecast.forecastday;

    // Update the DOM with current weather data and forecast data
    updateCurrentWeather(locationName, localTime, temp, conditionName, conditionEmoji);
    updateForecast(forecastDays);

  } catch (error) {
    console.error("ERROR ::: ", error.message);
    alert('Kindly enter a valid city name');
  }
}

// Initial call to get data for a default city
getData('New Delhi');
