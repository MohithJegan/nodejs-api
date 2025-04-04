// Get all the movies for the genre id
async function getMoviesThroughGenre(genreId) {
  // request the API
  const requestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API}&with_genres=${genreId}&language=en-US`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  // return the JSON response
  return await response.json();
}

// Get a movie through movie id
async function getMovieThroughId(movieId) {
  // request the API
  const requestUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  // return the JSON response
  return await response.json();
}

// export the functions
module.exports = {
  getMoviesThroughGenre,
  getMovieThroughId,
};
