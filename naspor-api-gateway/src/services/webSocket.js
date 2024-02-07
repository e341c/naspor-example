const WebSocket = require("ws")

const setupWebsocket = () => {
    const ws = new WebSocket("ws://naspor-chats:6002")
    ws.on("open", () => {
        console.log('WebSocket connection opened to microservice');
    })

    ws.on('message', (data) => {
        console.log('Received message from microservice:', data);
        // Handle the incoming WebSocket message as needed
    });
    
    // Event handler for connection close
    ws.on('close', () => {
        console.log('WebSocket connection to microservice closed');
    });
    
    // Event handler for connection error
    ws.on('error', (error) => {
        console.error('WebSocket connection error:', error);
    });
}

module.exports = setupWebsocket