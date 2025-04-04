// Get all the genres
async function getGenres() {
  // request the API
  const requestUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API}`;
  const response = await fetch(requestUrl);
  // return the JSON response
  return await response.json();
}

// export the functions
module.exports = {
  getGenres,
};
