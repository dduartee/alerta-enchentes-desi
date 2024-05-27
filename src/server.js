const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/teste', (req, res) => {
    res.status(200).send("TESTE")
});

//implemente uma nova rota aqui chamada de /sendSMS
//também implemente o método que irá enviar SMS ()

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
