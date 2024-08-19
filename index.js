// Replace with your OMDB API key
const API_KEY = "b80b12c9";
const API_URL = "http://www.omdbapi.com/";
const moviesList = document.getElementById("moviesList");
const pagination = document.getElementById("pagination");
const details = document.getElementById("details");

// Function to fetch movies from OMDB API
function fetchMovies(searchTerm, type, page = 1) {
  const url = `${API_URL}?s=${encodeURIComponent(searchTerm)}&type=${type}&page=${page}&apikey=${API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to fetch movies from OMDB API with a global variable to track current page
let currentPage = 1;

// Function to display movies
function displayMovies(data) {
    if (data.Response === "False") {
      moviesList.innerHTML = "<p>Movie not found!</p>";
      pagination.innerHTML = "";
      return;
    }
  
    const { Search: movies, totalResults } = data;
    moviesList.innerHTML = movies
      .map(
        (movie) => `
          <div class="movie">
              <h3>${movie.Title} (${movie.Year})</h3>
              <button onclick="fetchDetails('${movie.imdbID}')">Details</button>
          </div>
      `
      )
      .join("");
  
    const totalResultsPerPage = window.innerWidth < 768 ? 5 : 10; // Adjust the number of movies per page based on screen size
    const totalPages = Math.ceil(totalResults / totalResultsPerPage);
  
    // Update pagination
    let paginationButtons = '';
  
    if (totalPages > 1) {
      if (currentPage > 1) {
        paginationButtons += `<button onclick="changePage(1)">First</button>`;
        paginationButtons += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
      }
  
      if (currentPage < totalPages) {
        paginationButtons += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
        paginationButtons += `<button onclick="changePage(${totalPages})">Last</button>`;
      }
    }
  
    pagination.innerHTML = paginationButtons;
  }
  


// Function to change the page
function changePage(page) {
  currentPage = page;
  fetchMovies(
    document.getElementById("movieName").value,
    document.getElementById("type").value,
    currentPage
  );
}

// Function to fetch movie details
function fetchDetails(imdbID) {
  const url = `${API_URL}?i=${imdbID}&apikey=${API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayDetails(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to display movie details
function displayDetails(movie) {
  details.innerHTML = `
    <h2>${movie.Title} (${movie.Year})</h2>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <img src="${movie.Poster}" alt="${movie.Title}" style="max-width: 300px;">
  `;
}

// Event listener for search form
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 1; // Reset to the first page on a new search
    const searchTerm = document.getElementById("movieName").value;
    const type = document.getElementById("type").value;
    fetchMovies(searchTerm, type);
  });

