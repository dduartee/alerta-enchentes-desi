const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
app.get('/data', (req, res) => {

    //implemente a lógica aqui

    
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
