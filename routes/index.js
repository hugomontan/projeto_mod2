const express = require('express');
const router = express.Router();

// Exemplo de rota GET
router.get('/', (req, res) => {
  res.send('Rota principal funcionando!');
});

module.exports = router;
