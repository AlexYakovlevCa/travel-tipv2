import { apiService } from '../api-keys/api.service.js'

export const weatherService = {
  getWeather,
}
function getWeather(lat, lng) {
  const weURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${apiService.getWeatherApi()}`

  return axios.get(weURL).then((res) => {
    return {
      des: res.data.weather[0].description,
      icon: `http://openweathermap.org/img/w/${res.data.weather[0].icon}.png`,
      temp:res.data.main.temp,
      humid:res.data.main.humidity
    }
  })
}
// `http://openweathermap.org/img/w/${res.data.weather[0].icon}.png`