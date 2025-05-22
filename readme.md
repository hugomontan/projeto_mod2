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

| Pasta/Arquivo          | Conteúdo                                  |
|------------------------|-------------------------------------------|
| **assets/**            | Arquivos estáticos                        |
| └── bdiagram.png       | Diagrama do banco de dados                |
| **config/**            | Arquivos de configuração                  |
| └── database.js        | Conexão com o banco                       |
| **controllers/**       | Controladores                             |
| ├── ReservasController.js | Lógica de controle de reservas         |
| ├── SalasController.js    | Lógica de controle de salas            |
| └── UsuariosController.js | Lógica de controle de usuários         |
| **models/**            | Modelos de dados                          |
| ├── ReservasModel.js   | Modelo de dados de reservas               |
| ├── SalasModel.js      | Modelo de dados de salas                  |
| └── usuariosModel.js   | Modelo de dados de usuários               |
| **routes/**            | Definição de rotas                        |
| ├── index.js           | Arquivo principal de rotas                |
| ├── reservas_routes.js | Rotas relacionadas às reservas            |
| ├── salas_routes.js    | Rotas relacionadas às salas               |
| └── usuarios_routes.js | Rotas relacionadas aos usuários           |
| **services/**          | Serviços auxiliares                       |
| └── userService.js     | Serviços relacionados aos usuários        |
| **scripts/**           | Scripts auxiliares                        |
| └── db.sql             | Script de criação do banco de dados       |
| **tests/**             | Testes unitários                          |
| **Arquivos raiz**      |                                           |
| .env                   | Variáveis de ambiente                     |
| .gitignore             | Arquivos ignorados pelo Git               |
| jest.config.js         | Configuração do Jest                      |
| package-lock.json      | Dependências travadas                     |
| package.json           | Dependências do projeto                   |
| readme.md              | Documentação                              |
| rest.http              | Arquivo para testar requisições HTTP      |
| server.js              | Servidor principal                        |
| WAD.md                 | Documentação adicional (WAD)              |

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

## Diagrama de arquitetura 

![](assets\diagram.png)
