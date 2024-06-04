import { setupWebSocket, sendSearchQuery } from './scripts/websocket.js';
import { fetchMovies, fetchMovieDetails, fetchMovieCast, fetchNewsArticles } from './scripts/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const movieDetailsContainer = document.getElementById('movie-details-container');
    const newsArticlesContainer = document.getElementById('news-articles');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Initialize WebSocket connection
    setupWebSocket();

    // Event listener for the search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query) {
            sendSearchQuery(query);
        } else {
            document.getElementById('suggestions').innerHTML = '';
        }
    });

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            // Clear previous search results, movie details, and suggestions
            searchResults.innerHTML = '';
            movieDetailsContainer.innerHTML = '';
            newsArticlesContainer.innerHTML = '';
            document.getElementById('suggestions').innerHTML = '';

            // Show loading indicator
            loadingIndicator.style.display = 'block';

            // Fetch new search results
            fetchMovies(query).then(displayResults).finally(() => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            });
        }
    });

    // Display search results
    const displayResults = (movies) => {
        searchResults.innerHTML = '';
        if (movies.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'movie';
            const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'assets/images/placeholder.png';
            movieElement.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
                <button onclick="showDetails(${movie.id}, '${movie.title}')">Details</button>
            `;
            searchResults.appendChild(movieElement);
        });
    };

    // Show movie details
    window.showDetails = async (movieId, title) => {
        // Show loading indicator
        loadingIndicator.style.display = 'block';

        const movieDetailsData = await fetchMovieDetails(movieId);
        const movieCast = await fetchMovieCast(movieId);
        const newsArticles = await fetchNewsArticles(title);
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';

        if (movieDetailsData) {
            displayMovieDetails(movieDetailsData, movieCast, newsArticles);
            scrollToDetails();
        }
    };

    // Display movie details
    const displayMovieDetails = (movie, cast, newsArticles) => {
        const castList = cast.map(actor => `<li>${actor.name} as ${actor.character}</li>`).join('');
        const newsList = newsArticles.length > 0 ? newsArticles.map(article => `
            <div class="news-article">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `).join('') : '<p>No articles found</p>';

        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/images/placeholder.png';

        movieDetailsContainer.innerHTML = `
            <div>
                <img id="movie-poster" src="${posterPath}" alt="${movie.title}">
            </div>
            <div id="movie-details">
                <h2>${movie.title}</h2>
                <p id="movie-overview">${movie.overview}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Rating:</strong> ${movie.vote_average}</p>
                <h3>Cast:</h3>
                <ul class="cast-list">${castList}</ul>
                <button id="watch-trailer" onclick="window.open('https://www.youtube.com/results?search_query=${movie.title}+trailer', '_blank')">Watch Trailer</button>
                <button id="view-articles">View Articles</button>
            </div>
        `;

        newsArticlesContainer.innerHTML = `
            <h2>Related News Articles</h2>
            ${newsList}
        `;

        // Add smooth scrolling for "View Articles" button
        document.getElementById('view-articles').addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelector('#news-articles').scrollIntoView({ behavior: 'smooth' });
        });
    };

    // Scroll to the movie details section
    const scrollToDetails = () => {
        movieDetailsContainer.scrollIntoView({ behavior: 'smooth' });
    };
});
