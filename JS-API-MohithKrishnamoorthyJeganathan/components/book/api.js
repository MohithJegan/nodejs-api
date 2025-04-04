// Get all the books for the genre
async function getBooksThroughGenre(genreName) {
  // request the API
  const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${genreName}&key=${process.env.GOOGLE_API}`;
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

// Get a book through book id
async function getBookThroughBookId(bookId) {
  // request the API
  const requestUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    header: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  // return the JSON response
  return await response.json();
}

// Check the open library image for the book
async function checkOpenLibraryCover(isbn) {
  if (!isbn) return false;

  try {
    const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    // check with HEAD request
    const headResponse = await fetch(url, { method: "HEAD" });

    if (!headResponse.ok) return false;

    // Verify content length
    const contentLength = headResponse.headers.get("content-length");
    if (contentLength && parseInt(contentLength) < 5000) return false;

    // check with a GET request
    const imgResponse = await fetch(url, {
      headers: { Range: "bytes=0-1000" },
    });
    const blob = await imgResponse.blob();

    // Additional checks for actual image data
    return blob.size > 5000 && blob.type.startsWith("image/");
  } catch (error) {
    console.error(`Cover check failed for ISBN ${isbn}:`, error);
    return false;
  }
}

// Get the cover image for the book
async function getBooksWithCoverImage(bookData) {
  const bookObj = { ...bookData };
  bookObj.volumeInfo = { ...bookObj.volumeInfo };
  bookObj.volumeInfo.imageLinks = { ...bookObj.volumeInfo.imageLinks };
  // Array of fallback images
  // Citations - https://archive.org/details/covers_0005
  const fallbackImages = [
    "https://ia600603.us.archive.org/30/items/mma_henry_miller_author_270723/270723.jpg",
    "https://ia600803.us.archive.org/35/items/mma_alfred_adler_carmel_270649/270649.jpg",
    "https://ia600906.us.archive.org/23/items/NG.M.00809/100062122.jpg",
    "https://ia800906.us.archive.org/23/items/NG.M.00809/1004998876.jpg",
    "https://ia800906.us.archive.org/23/items/NG.M.00809/1104791812.jpg",
    "https://ia801508.us.archive.org/15/items/internetarchivepressphoto-ttscribe02/ttscribe.jpeg",
    "https://ia801400.us.archive.org/2/items/JeanMetzingerPortraitPhotographPublishedInLesPeintresCubistes1913/1.-BLANCHARD-MARIE-Composicion-cubista_low.jpg",
    "https://ia801400.us.archive.org/2/items/JeanMetzingerPortraitPhotographPublishedInLesPeintresCubistes1913/282004301_.jpg",
    "https://ia801200.us.archive.org/28/items/book-vilgefortz-fanart-by-ulamb_illu./IMG_20240104_182219.jpg",
    "https://dn721602.ca.archive.org/0/items/book-geralt-of-rivia-portrait-fanart-by-leo-cherel./Fo7XQuoXoAASdXb.jpg",
    "https://ia800901.us.archive.org/12/items/alecsoth04/2001_08zl0041_f.jpg",
    "https://ia600901.us.archive.org/12/items/alecsoth04/2003_02zm0026-09_f.jpg",
    "https://ia800608.us.archive.org/3/items/extended-the-witcher-world-map-by-sigi-groovin./M8Bx2mNFq2x8j3S2LjV5ti.jpeg",
    "https://dn721903.ca.archive.org/0/items/neon-genesis-evangelion-calendar-2015_202101/05%2C%2006.jpg",
    "https://ia601602.us.archive.org/4/items/book-geralt-and-book-ciri-fanart-by-anna-dmyterchuk/anna-dmyterchuk-img-20230212-174952-081.jpg",
  ];

  // check for id type to be ISBN_13
  const isbn = bookObj.volumeInfo?.industryIdentifiers?.find(
    (id) => id.type === "ISBN_13"
  )?.identifier;

  const hasCover = isbn ? await checkOpenLibraryCover(isbn) : false;

  bookObj.volumeInfo.imageLinks.thumbnail = hasCover
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
    : fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  // return the book object
  return bookObj;
}

// export the functions
module.exports = {
  getBooksThroughGenre,
  getBookThroughBookId,
  checkOpenLibraryCover,
  getBooksWithCoverImage,
};
