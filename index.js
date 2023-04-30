const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // Import the routes
const path = require('path'); // Import the path module

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(routes); // Use the routes

// Add a route to serve the openapi.yaml file
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// Add a route to serve the manifest file (.well-known/ai-plugin.json)
app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.sendFile(path.join(__dirname, '.well-known', 'ai-plugin.json'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

