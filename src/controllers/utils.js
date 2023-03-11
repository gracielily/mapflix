import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export function getImagePublicId(imageUrl) {
    return imageUrl.split("/").slice(-1)[0].split(".")[0];
}

export const IMAGE_PAYLOAD = {
    multipart: true,
    output: "data",
    maxBytes: 209715200,
    parse: true,
  }


  export async function getMovieData(imdbId){
    let res = {}
    try {
        res = await axios.get(`https://api.themoviedb.org/3/movie/${imdbId}?api_key=${process.env.TMDB_API_KEY}`);
        return res.data;
    } catch(error) {
        console.log(error)
    }
    return res
  }