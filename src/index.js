// esse index eh o arquivo principal da aplicacao!
const express = require('express');
const bodyParser = require('body-parser'); //BODYPARSER PERMITE A UTILIZACAO DE JSON

const app = express(); //so existe um "app" na aplicacao

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.listen(3000);
