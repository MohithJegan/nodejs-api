//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

//Get API handlers for the components
const genre = require("./components/genre/api");
const movie = require("./components/movie/api");
const book = require("./components/book/api");

//set up Express app
const app = express();
const port = process.env.PORT || 8080;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

/* 
  Typically, forms send data in the urlencoded format. The following two lines of code will extend the allowed types to use JSON
*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//PAGE ROUTES

//Home page route
app.get("/", async (request, response) => {
  // Get all the genres
  const genres = await genre.getGenres();
  // Render the home page with all the genres for user selection
  response.render("index", { genreList: genres.genres });
});

//Genre page route
app.get("/genres", async (request, response) => {
  // Get all the genres
  const genres = await genre.getGenres();
  response.render("genres", { genreList: genres.genres });
});

//Movie page route
app.get("/movies", async (request, response) => {
  // Get all the genres
  const genres = await genre.getGenres();
  // Get all the movies for the genres
  const movies = await Promise.all(
    genres.genres.map(async (genre) => {
      const moviesByGenre = await movie.getMoviesThroughGenre(+genre.id);
      return moviesByGenre.results;
    })
  );
  const movieList = movies.flat();
  // Render the movies page with all the movies
  response.render("movies", { movieList: movieList });
});

//Books page route
app.get("/books", async (request, response) => {
  // Get all the genres
  const genres = await genre.getGenres();
  const bookList = [];
  // Get all the books for the genres
  const books = await Promise.all(
    genres.genres.map(async (genre) => {
      const booksByGenre = await book.getBooksThroughGenre(genre.name);
      return booksByGenre.items;
    })
  );
  const allBooks = books.flat();
  // Get the cover image for the books
  const booksWithCovers = await Promise.all(
    allBooks.map(async (singleBook) => {
      const bookObj = await book.getBooksWithCoverImage(singleBook);
      bookList.push(bookObj);
    })
  );
  // Render the books page with all the books
  response.render("books", { bookList: bookList });
});

// Movies and Books data for the selected genre
app.post("/genre/data", async (request, response) => {
  // Get the genre id & genre name from the user selected genre
  const [genreId, genreName] = request.body.selectedGenre.split(" ");
  // Get all the movies for the genre id
  const movieData = await movie.getMoviesThroughGenre(+genreId);
  // Get all the books for the genre name
  const bookData = await book.getBooksThroughGenre(genreName.toLowerCase());
  const bookList = [];
  const booksWithCovers = await Promise.all(
    bookData.items.map(async (singleBook) => {
      // Get the cover images for the book
      const bookObj = await book.getBooksWithCoverImage(singleBook);
      bookList.push(bookObj);
    })
  );
  // Render the show page with movies & books
  response.render("show", {
    genreId: genreId,
    genreName: genreName,
    movieList: movieData.results,
    bookList: bookList,
  });
});

// Movie details for the selected genre
app.get("/movie/details/:id", async (request, response) => {
  // Get the movie id from the user selected movie
  const movieId = Number(request.params.id);
  // Get the movie info
  const movieData = await movie.getMovieThroughId(movieId);
  // Render the details page with movie info
  response.render("details", { movie: movieData, type: "movie" });
});

// Book details for the selected genre
app.get("/book/details/:id", async (request, response) => {
  // Get the book id from the user selected book
  const bookId = request.params.id;
  // Get the book info
  const bookData = await book.getBookThroughBookId(bookId);
  // Get the cover image for the book
  const bookObj = await book.getBooksWithCoverImage(bookData);
  // Render the details page with book info
  response.render("details", { book: bookObj, type: "book" });
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
