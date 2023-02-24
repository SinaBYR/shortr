const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const apiRoutes = require('./routes/api.route');
const redirectRoutes = require('./routes/redirect.route');
const pageRoutes = require('./routes/pages.route');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', apiRoutes);
app.use('/', redirectRoutes);
app.use('/', pageRoutes);

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
})