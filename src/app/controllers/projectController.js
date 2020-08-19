//USUARIO TERA QUE ESTAR AUTENTICADO PARA FAZER AS REQUISICOES
const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.send({ ok: true, user: req.userId });
});

module.exports = app => app.use('/projects', router);
