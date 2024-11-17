// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/generate-code', (req, res) => {
    const blocks = req.body.blocks;
    const generatedCode = convertBlocksToCode(blocks);
    res.send({ code: generatedCode });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

function convertBlocksToCode(blocks) {
    return 'Código generado a partir de bloques';
}
