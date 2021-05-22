const express = require('express');
const app = express();
const { PORT } = require('./common/config');
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');

db.sync();

app.use(require('body-parser').json()); 

app.use('/api/auth', user);
app.use(require('./middleware/validate-session'));
app.use('/api/game', game);
app.listen(PORT, () => { 
    console.log(`App is listening on http://localhost:${PORT}`);
});
