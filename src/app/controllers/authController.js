//AUTENTICACAO.
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}
//ROTA DE REGISTRO DO USUARIO.
router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exists' }); //APLICANDO ERRO "USUARIO JA EXISTE".

    const user = await User.create(req.body);

    user.password = undefined; //PARA DE RETORNAR A SENHA (MESMO QUE CRIPTOGRAFADA).

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ error: 'Registration Failed' });
  }
});

//ROTA DE AUTENTICACAO DO USUARIO.
router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password'); //PEGANDO NOVAMENTE A SENHA PARA AUTENTICAR ELA.

  if (!user) {
    return res.status.send({ error: 'User not found' });
  }
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: 'Invalid password' });

  user.password = undefined;
  //criando autenticacao por token
  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 86400,
  });

  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});

//ROTA "ESQUECI MINHA SENHA".
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await user.findOne({ email });
    if (!user) return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1 );

    await User.findByIdAndUpdate(user.id, {
      '$set':{
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });
    mailer.sendMail({
    to: email,
    from:'victor@gmail.com',
    template:'auth/forgot_password',
    context: { token },
    }, (err)=>{
      if(err)
      return res.status(400).send({error: 'cannot send forgot password email'});

      return res.send();
    }) 
  } catch (err) {
    res.status(400).send({ error: 'Error, try again' });
  }
});

module.exports = (app) => app.use('/auth', router); // repassando router para o "app" com o prefixo "/auth".
