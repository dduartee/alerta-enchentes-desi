const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.get('/teste', (req, res) => {
    res.status(200).send({teste:"TESTE"})
});

//rota para envio de SMS
app.get('/sendSMS', (req, res) => {

    //implemente a lógica aqui

});

//rota para atualizar os gráficos
app.get('/data', async(req, res) => {

    //implemente sua solução aqui

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
