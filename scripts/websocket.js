let socket;

export const setupWebSocket = () => {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        const suggestions = JSON.parse(event.data);
        console.log('WebSocket message received:', suggestions);
        displaySuggestions(suggestions);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return socket;
};

const displaySuggestions = (suggestions) => {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    // Use a Set to filter out duplicate titles
    const uniqueTitles = new Set();
    suggestions.forEach(suggestion => {
        if (!uniqueTitles.has(suggestion.title)) {
            uniqueTitles.add(suggestion.title);
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion';
            suggestionElement.innerText = suggestion.title;
            suggestionElement.onclick = () => {
                document.getElementById('search-input').value = suggestion.title;
                suggestionsContainer.innerHTML = '';
                // Automatically trigger search
                document.getElementById('search-button').click();
            };
            suggestionsContainer.appendChild(suggestionElement);
        }
    });
};

export const sendSearchQuery = (query) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(query);
    }
};
