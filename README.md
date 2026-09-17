# WasSMM Painel
Painel web para consultar serviços, saldo, criar pedidos e consultar status.

## Segurança
A chave da WasSMM fica somente no backend, no arquivo `.env`. **Nunca coloque a chave diretamente no `index.html` nem publique `.env` no GitHub.**

## Instalação
npm install
cp .env.example .env
# edite .env
npm start

Se a API da sua conta usar parâmetros diferentes, ajuste somente as rotas em `server.js`.
