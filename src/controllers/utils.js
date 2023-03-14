import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export function getImagePublicId(imageUrl) {
    return imageUrl.split("/").slice(-1)[0].split(".")[0];
};

export const IMAGE_PAYLOAD = {
    multipart: true,
    output: "data",
    maxBytes: 209715200,
    parse: true,
};

export async function getMovieData(imdbId) {
    let res = {}
    try {
        res = await axios.get(`https://api.themoviedb.org/3/movie/${imdbId}?api_key=${process.env.TMDB_API_KEY}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
    return res
};


export async function getWeatherData(point) {
    let data = {}
    try {
        const res = await axios
            .get("https://api.openweathermap.org/data/2.5/onecall", {
                params: {
                    lat: point.latitude,
                    lon: point.longitude,
                    units: "metric",
                    appid: process.env.OPEN_WEATHER_MAP_API_KEY
                }
            })
        const currentWeather = res.data.current;
        data = {
            label: currentWeather.weather[0].main,
            temperature: currentWeather.temp,
        };
    } catch (error) {
        console.log(error)
    };
    return data
}