const { getOrderCount } = require('../services/orderIdService');

// Store active connections to broadcast to
let clients = [];
const MAX_SEATS = parseInt(process.env.MAX_SEATS || '60', 10);
const MAX_CONNECTIONS = 200;

function liveCount (req, res)  {
  if (clients.length >= MAX_CONNECTIONS) {
    return res.status(429).json({ error: 'Too many live connections. Try again later.' });
  }
  // Headers to establish SSE connection
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send the initial count immediately upon connection
  const initialCount = getOrderCount();
  res.write(`data: ${JSON.stringify({ count: initialCount, maxSeats: MAX_SEATS })}\n\n`);

// Send a heartbeat every 30 seconds to bypass Render's 100s timeout
  const heartbeat = setInterval(() => {
    res.write(': keep-alive\n\n'); // SSE comment format
  }, 30000);

  // Track client connection
  clients.push(res);

  // Remove client when connection drops
  req.on('close', () => {
    clearInterval(heartbeat);
    clients = clients.filter(client => client !== res);
  });
};

function broadcast() {
    const newCount = getOrderCount();
    clients.forEach(client => {
        try {
            client.write(`data: ${JSON.stringify({ count: newCount, maxSeats: MAX_SEATS })}\n\n`);
        } catch (err) {
            // Socket might have closed before 'close' handler ran
            console.error('Failed to write to client socket:', err.message);
        }
    });
}

module.exports = { liveCount, broadcast };