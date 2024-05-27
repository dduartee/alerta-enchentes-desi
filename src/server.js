const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/teste', (req, res) => {
    res.status(200).send("TESTE")
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
