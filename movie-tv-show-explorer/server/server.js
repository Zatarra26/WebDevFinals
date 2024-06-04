const WebSocket = require('ws');

let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        const query = message.toString();
        console.log(`Received search query: ${query}`);

        // Fetch search suggestions from TMDb API
        const suggestions = await fetchSearchSuggestions(query);

        // Send suggestions back to the client
        ws.send(JSON.stringify(suggestions));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');

async function fetchSearchSuggestions(query) {
    const apiKey = '4fc23459f91f0511543f8721c6be3214'; // Replace with your TMDb API key
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
        }));
    } catch (error) {
        console.error('Error fetching search suggestions:', error);
        return [];
    }
}
