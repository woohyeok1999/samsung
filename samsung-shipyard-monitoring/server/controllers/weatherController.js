const axios = require('axios');
const cheerio = require('cheerio');

exports.getWeather = async (req, res) => {
    try {
        const response = await axios.get('https://weather.com/ko-KR/weather/today/l/99349386238dc9785ec0a58d94469567b5b7c7705f2ea8254ccc217d6f691550');
        const $ = cheerio.load(response.data);

        const todayDetails = extractTodayDetails($);
        const dailyForecast = extractDailyForecast($);

        res.json({ todayDetails, dailyForecast });
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        res.status(500).json({ error: 'Failed to fetch or parse weather data', message: error.message });
    }
};

function extractTodayDetails($) {
    return {
        location: $('h1[data-testid="CurrentConditionsLocation"]').text().trim(),
        feelsLike: $('.TodayDetailsCard--feelsLikeTempValue--2icPt').text().trim(),
        highLow: $('.WeatherDetailsListItem--wxData--kK35q').first().text().trim(),
        wind: $('span[data-testid="Wind"]').text().trim(),
        humidity: $('span[data-testid="PercentageValue"]').first().text().trim(),
        dewPoint: $('.WeatherDetailsListItem--wxData--kK35q').eq(3).text().trim(),
        pressure: $('.WeatherDetailsListItem--wxData--kK35q').eq(4).text().trim(),
        uvIndex: $('span[data-testid="UVIndexValue"]').text().trim(),
        visibility: $('span[data-testid="VisibilityValue"]').text().trim(),
        moonPhase: $('.WeatherDetailsListItem--wxData--kK35q').last().text().trim(),
        sunrise: $('.TwcSunChart--dateValue--2WK2q').first().text().trim(),
        sunset: $('.TwcSunChart--dateValue--2WK2q').last().text().trim(),
    };
}

function extractDailyForecast($) {
    const forecast = [];
    $('.DailyWeatherCard--TableWrapper--2bB37 .Column--column--3tAuz').each((i, el) => {
        const $el = $(el);
        forecast.push({
            day: $el.find('.Column--label--2s30x').text().trim(),
            icon: $el.find('.Column--icon--2TNHl svg title').text().trim(),
            highTemp: $el.find('.Column--temp--1sO_J').text().trim().split('/')[0],
            lowTemp: $el.find('.Column--temp--1sO_J').text().trim().split('/')[1] || $el.find('.Column--tempLo--1uHbC').text().trim(),
            precipitation: $el.find('.Column--precip--3JCDO').text().replace(/강수확률/, '').trim(),
        });
    });
    return forecast;
}