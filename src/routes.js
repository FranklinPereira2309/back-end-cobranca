const express = require('express')
const { userRegister, userRegisterEmailValidation, getUser, updateUser } = require('./controllers/users');
const { userLogin } = require('./controllers/usersLogin');
const { registerClient, listAllClients, clientDetails, updateClient } = require('./controllers/clients');
const loginFilter = require('./filters/loginFilter');
const { registerCharge, getCharges } = require('./controllers/charge');
const cors = require('cors');

const routes = express();

routes.options('*', cors());

routes.post('/login', userLogin);

routes.post('/validar-email', userRegisterEmailValidation);
routes.post('/cadastro-usuario', userRegister);

routes.use(loginFilter);

routes.get('/obter-usuario', getUser);
routes.patch('/atualizar-usuario', updateUser);

routes.post('/cadastro', registerClient);
routes.get('/listar-clientes', listAllClients);
routes.get('/detalhar-cliente/:id', clientDetails);
routes.patch('/atualizar-cliente/:id', updateClient);

routes.post('/cadastro-cobranca', registerCharge);
routes.get('/listagem-cobrancas', getCharges);

module.exports = routes;