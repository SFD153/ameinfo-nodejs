/**
 * WeatherController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Promise = require('bluebird');
const weather = require('openweather-apis');

module.exports = {


  /**
   * `WeatherController.find()`
   */
  find: async function (req, res) {
    weather.setLang(sails.config.custom.openWeatherLanguage);
    weather.setCityId(sails.config.custom.openWeatherCityId);
    weather.setAPPID(sails.config.custom.openWeatherAppId);
    const getAllWeather = Promise.promisify(weather.getAllWeather);

    try {
      const allWeather = await getAllWeather();
      return res.ok({ country: 'dubai', ...allWeather });
    } catch (e) {
      return res.serverError(e);
    }
  }

};

