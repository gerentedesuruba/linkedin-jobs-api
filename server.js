// backend/server.js
const express = require('express');
// A forma correta de importar a função query exportada
const { query } = require('./index'); 

const app = express();
const port = 3000;

app.use(express.json());

app.get('/jobs', async (req, res) => {
  console.log('Recebida requisição para /jobs com os query params:', req.query);

  const options = {
    keyword: req.query.keyword,
    location: req.query.location,
    dateSincePosted: req.query.dateSincePosted,
    jobType: req.query.jobType,
    remoteFilter: req.query.remoteFilter,
    salary: req.query.salary,
    experienceLevel: req.query.experienceLevel,
    limit: req.query.limit || 50,
    sortBy: req.query.sortBy || 'recent',
    noCache: req.query.noCache,
  };

  if (!options.keyword || !options.location) {
    console.error('Erro: keyword e location são obrigatórios.');
    return res.status(400).json({ message: 'Os campos "keyword" e "location" são obrigatórios.' });
  }

  try {
    console.log('Chamando a API do LinkedIn com as opções:', options);
    // Chama a função query diretamente
    const jobs = await query(options);
    console.log(`Sucesso! Encontradas ${jobs.length} vagas.`);
    res.json(jobs);
  } catch (error) {
    console.error('Erro ao consultar a API do LinkedIn:', error);
    res.status(500).json({ message: 'Ocorreu um erro ao buscar as vagas no LinkedIn.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
