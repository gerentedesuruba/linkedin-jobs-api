//aaaaa
// backend/server.js
const express = require('express');
const { query } = require('./index');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/jobs', async (req, res) => { // Rota atualizada para /api/jobs
  console.log('Recebida requisição para /api/jobs com os query params:', req.query);

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
    noCache: req.query.noCache === 'true', // Garante que seja booleano
  };

  if (!options.keyword || !options.location) {
    console.error('Erro: keyword e location são obrigatórios.');
    return res.status(400).json({ message: 'Os campos "keyword" e "location" são obrigatórios.' });
  }

  try {
    console.log('Chamando a API do LinkedIn com as opções:', options);
    const jobs = await query(options);
    console.log(`Sucesso! Encontradas ${jobs.length} vagas.`);
    res.json(jobs);
  } catch (error) {
    console.error('Erro ao consultar a API do LinkedIn:', error);
    res.status(500).json({ message: 'Ocorreu um erro ao buscar as vagas no LinkedIn.' });
  }
});

// Novo endpoint para scraping da descrição
app.get('/api/description', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: 'O parâmetro "url" da vaga é obrigatório.' });
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        // Simula um navegador para evitar bloqueios simples
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    
    // O seletor foi validado com o arquivo HTML fornecido
    const descriptionHTML = $('.description__text').html();

    if (!descriptionHTML) {
      return res.status(404).json({ message: 'Descrição não encontrada na página da vaga. O layout do LinkedIn pode ter mudado.' });
    }

    res.json({ description: descriptionHTML });

  } catch (error) {
    console.error('Erro ao fazer scraping da descrição da vaga:', error);
    res.status(500).json({ message: 'Ocorreu um erro ao buscar a descrição da vaga.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});
