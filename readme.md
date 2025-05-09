# Sistema de Reserva de Salas Acadêmicas

##  Descrição
Sistema para gerenciamento de reservas de salas:
- Cadastro de salas (ateliês e salas de estudo)
- Reservas por horário com prevenção de conflitos
- Consulta de disponibilidade em tempo real

## Recursos
- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite

## Estrutura de arquivos 

| Pasta/Arquivo          | Conteúdo                |
|------------------------|-------------------------|
| **config/**            | Arquivos de configuração|
| └── database.js        | Conexão com o banco     |
| **controllers/**       | Controladores           |
| └── HomeController.js  | Lógica principal        |
| **models/**            | Modelos de dados        |
| └── User.js            | Modelo de usuário       |
| **routes/**            | Definição de rotas      |
| └── index.js           | Rotas do sistema        |
| **services/**          | Serviços auxiliares     |
| └── userService.js     | Serviços de usuário     |
| **assets/**            | Arquivos estáticos      |
| **scripts/**           | JavaScript público      |
| **styles/**            | Arquivos CSS            |
| **tests/**             | Testes unitários        |
| └── example.test.js    | Exemplo de teste        |
| **Arquivos raiz**      |                         |
| .gitignore             | Ignorados pelo Git      |
| .env.example           | Variáveis de ambiente   |
| jest.config.js         | Configuração do Jest    |
| package-lock.json      | Dependências travadas   |
| package.json           | Dependências do projeto |
| readme.md              | Documentação            |
| server.js              | Servidor principal      |
| rest.http              | (opcional)|

## Como executar o projeto localmente

1. **Clonar o repositório:**

   ````
   git clone https://github.com/hugomontan/projeto_mod2.git
   cd Inteli-M2-Projeto-individual
   ````

2. **Instalar as dependências:**

````
 npm install 
 ````

3. **Inicie o servidor:**

````
 npm start 
 ````
