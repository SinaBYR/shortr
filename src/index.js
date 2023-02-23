const express = require('express');
const app = express();
const PORT = 3000;
const apiRoutes = require('./routes/api.route');

app.use(express.json());

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
})