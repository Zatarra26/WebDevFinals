const tmdbApiKey = '4fc23459f91f0511543f8721c6be3214';
const newsApiKey = '13f157f4c52c41ac840247c96f187c7c'; 
const newsApiUrl = 'https://newsapi.org/v2/everything';

export const fetchMovies = async (query) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

export const fetchMovieDetails = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`;
    try {
        const response = await fetch(url);
        const movie = await response.json();
        return movie;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

export const fetchMovieCast = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${tmdbApiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.cast;
    } catch (error) {
        console.error('Error fetching movie cast:', error);
        return [];
    }
};

export const fetchNewsArticles = async (query) => {
    const url = `${newsApiUrl}?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.articles.slice(0, 5); // Limit to 5 articles
    } catch (error) {
        console.error('Error fetching news articles:', error);
        return [];
    }
};