const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');


const app = express();

const PORT = 5000;

const apiKey = '22df51057097413212e1e5a9';

app.use(cors());

app.use(express.json());

app.get('/api/converter', async (req, res) => {
  const { valueInput1, selectedCountryLocal, selectedCountryOuter } = req.query;

  // Validação dos parâmetros
  if (!valueInput1 || !selectedCountryLocal || !selectedCountryOuter) {
    return res.status(400).json({ error: 'Parâmetros são obrigatórios.' });
  }

  const valor = parseFloat(valueInput1);
  if (isNaN(valor)) {
    return res.status(400).json({ error: 'valueInput1 deve ser um número válido.' });
  }

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${selectedCountryLocal.toUpperCase()}`);
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Erro ao buscar taxas da exchange.' });
    }

    const data = await response.json();

    const moedaDestino = selectedCountryOuter.toUpperCase();

    if (!data.rates[moedaDestino]) {
      return res.status(400).json({ error: 'Moeda destino não suportada.' });
    }

    const taxa = data.rates[moedaDestino];
    const valorConvertido = valor * taxa;

    res.json({
      valueInput2: Number(valorConvertido.toFixed(6))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
