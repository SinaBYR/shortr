const express = require('express');
const app = express();
const PORT = 3000;
const apiRoutes = require('./routes/api.route');
const redirectRoutes = require('./routes/redirect.route');

app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', redirectRoutes);

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
})