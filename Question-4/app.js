const express = require('express');
require('dotenv').config();
const apiController = require('./src/controllers/api-controller');

const app = express();
const PORT = process.env.PORT || 8080;
//api call for rate limit
app.get('/api/call/:input', apiController.handleApiRequest);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
