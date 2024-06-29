const apiKey = 'eecf4b124ba32a9cae9e1744cb7e7746';
const metric = 'metric';
const imperial = 'imperial';
const weatherDescription = document.getElementById('weather-description');
const tempature = document.getElementById('temp');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const body = document.getElementById('body');
const weatherIcon = document.getElementById('icon');
const zipCity = document.getElementById('city');
const date = document.getElementById('date')
// Create a new Date object representing the current date and time
const currentDate = new Date();

// Get the current year
const year = currentDate.getFullYear();

// Get the current month (Note: Months are zero-based, so January is 0)
const month = currentDate.getMonth(); // No need to add 1 here

// Get the current day of the month
const day = currentDate.getDate();

// Define an array of month names
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Get the month name from the array
const monthName = monthNames[month];

// Format the date as "Month Day, Year"
const formattedDate = `${monthName} ${day}, ${year}`;

// will get the weather data api url based on the zip code
const getZip = async (zipCode, units) => {
    return fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`)
    .then(response => response.json())
    .then(json => fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json.lat}&lon=${json.lon}&units=${units}&appid=${apiKey}`));
}

// will display the weather based on the zip code that is inputted
const displayWeather = (units) => {
    getZip(document.getElementById('search-box').value, units)
    .then(response => response.json())
    .then(json => {
        let description = json.weather[0].description;
        let temp = json.main.temp;
        let windKnots = json.wind.speed;
        let humidityPerc = json.main.humidity;
        let weatherID = json.weather[0].id;


        humidity.innerHTML = `${humidityPerc}%`;
        weatherDescription.innerHTML = description;
        zipCity.innerText = json.name;
        date.innerText = formattedDate;

        if (units === imperial) {
            tempature.innerHTML = `${Math.round(temp)}°F`;
            windSpeed.innerHTML = `${Math.round(windKnots * 1.15)}mph`
        } else if (units === metric){
            tempature.innerHTML = `${Math.round(temp)}°C`;
            windSpeed.innerHTML = `${Math.round(windKnots * 1.852)}km/h`;
        }

        //if it rains
        if((/^[235][0-9][0-9]/.test(weatherID))) {
            weatherIcon.innerHTML = `<img src="images/precipitation.png" class="img" alt="..." style="width: 100px;">`;
            body.style.backgroundImage = 'url(images/rainyday.gif';

        } 
        // if it doesnt rain
        else if ((/^8[0-9][0-9]/.test(weatherID))) {
            weatherIcon.innerHTML = `<img src="images/cloudy.png" class="img" alt="..." style="width: 100px;">`;
            body.style.backgroundImage = 'url(images/daycloud.gif)';
        }
    });
}

// updates clock
const updateClock = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, 0);
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    document.getElementById('clock').textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);