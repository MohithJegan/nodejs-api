#  Mercizon – Movie & Book Recommendation Hub

A web application that recommends **movies** and **books** based on your favorite **genre**.


## Features

- **Genre-Based Recommendations**: Select a genre and discover matching movies and books.
- **Movie Details**: View complete movie information powered by **TMDB API**.
- **Book Details**: Fetch detailed book data via **Google Books API** with high-quality cover images from **Open Library API**.
- **Responsive UI** using Bootstrap 5 and Bootstrap Icons.


## Routes Overview

- `/` – Home page with a dropdown to select a genre  
- `/genres` – Displays list of all available genres  
- `/movies` – Displays all movies from all genres  
- `/books` – Displays all books from all genres  
- `/genre/data` – Displays movies and books for the **selected genre**  
- `/movie/details/:id` – Detailed view of a selected movie  
- `/book/details/:id` – Detailed view of a selected book  


## APIs Used

### TMDB API
Used for fetching movie data and genres.

- `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}`  
  ↳ Get all genres  
- `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&with_genres=${genreId}`  
  ↳ Get movies by genre ID  
- `https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}`  
  ↳ Get movie details by movie ID

### Google Books API
Used for fetching books by genre and specific book details.

- `https://www.googleapis.com/books/v1/volumes?q=subject:${genreName}&key=...`  
  ↳ Get books by genre name  
- `https://www.googleapis.com/books/v1/volumes/${bookId}`  
  ↳ Get book details by book ID

### Open Library API
Used for high-quality book cover images.

- `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`  
  ↳ Get book cover by ISBN  


## Functions

### Genre Functions
- `getGenres()` – Get list of all movie genres

### Movie Functions
- `getMoviesThroughGenre(genreId)` – Fetch movies by genre
- `getMovieThroughId(movieId)` – Fetch detailed info about a movie

### Book Functions
- `getBooksThroughGenre(genreName)` – Get all books for the selected genre
- `getBookThroughBookId(bookId)` – Fetch a book by its ID
- `checkOpenLibraryCover(isbn)` – Validate if a high-res Open Library image exists
- `getBooksWithCoverImage(books)` – Enhance books with best available cover images
