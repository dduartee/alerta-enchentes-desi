const express = require('express');
const cors = require('cors');
const axios = require('axios');
const twilio = require('twilio');
const dotenv = require('dotenv')
dotenv.config();

const accountSid = process.env.AccountSID;
const authToken = process.env.AuthToken;

const client = twilio(accountSid, authToken);


const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());

app.get('/teste', (req, res) => {
    res.status(200).send({ teste: "TESTE" })
});
const numerosAutorizados = [ // numeros verificados no twilio
    "+5549991868829"
]
const riosMonitorados = [
    { nome: "Xanxerê", channelID: 2572787, apiKey: process.env.API_KEY },
]
function getRioFeed(channelID, apiKey, results = 50) {
    return axios.get(`https://api.thingspeak.com/channels/${channelID}/feeds.json`, {
        params: {
            results,
        }
    })
}
function indiceRioMonitorado(nomeRio) {
    return riosMonitorados.findIndex(rio => rio.nome === nomeRio)
}
//rota para envio de SMS
app.get('/sendSMS', async (req, res) => { // sendSMS?nomeRio=Xanxerê
    const indiceRio = indiceRioMonitorado(req.query.nomeRio)
    if (indiceRio === -1) {
        return res.status(400).send({ success: false, message: "Rio não monitorado" })
    }
    const channelID = riosMonitorados[indiceRio].channelID;
    
    const response = await getRioFeed(channelID, process.env.API_KEY, 1);
    const altura = response.data.feeds[0].field1;
    const dataAtual = new Date().toLocaleString();
    const trialNumber = "+17745152897" // numero de teste do twilio
    const body = `Alerta!! A altura da água do rio ${req.query.nomeRio} está acima do normal. Altura: ${altura}m. Data:${dataAtual}`
    const messageSids = await Promise.all(numerosAutorizados.map(async numero => {
        const message = await client.messages.create({
            body,
            to: numero,
            from: trialNumber,
        });
        return message.sid;
    }));
    res.status(200).send({ success: true, messageSids })
});

//rota para atualizar os gráficos
app.get('/data', async (req, res) => { // /data?nomeRio=Xanxerê
    const indiceRio = indiceRioMonitorado(req.query.nomeRio)
    if (indiceRio === -1) {
        console.log(req.query.nomeRio)
        return res.status(400).send({ success: false, message: "Rio não monitorado" })
    }
    const channelID = riosMonitorados[indiceRio].channelID;

    const response = await getRioFeed(channelID, process.env.API_KEY);
    const data = response.data.feeds.map(feed => {
        return {
            created_at: feed.created_at,
            value: feed.field1
        }
    });
    return res.status(200).send(data);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
