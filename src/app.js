const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});



app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;//tecnologias que vem do corpo da requisição

  const repository = {//criando um novo repositório
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  if (!repository) {
    return response.status(400).send();
  }

  repositories.push(repository);//adiciona o repository dentro da lista de repositories

  return response.json(repository);//json com o repository q acabou de ser criado
});



//PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let repository = repositories.find( repository => repository.id == id )

  if (!repository)// se não encontrou o indice dá erro
    return response.status(400).json({ error: "Repositório não encontrado." })
  
  repository = {...repository, title, url, techs}

  return response.json( repository )
});


//DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  //encontra o índice do projeto 
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  if (repositoryIndex < 0)
    return response.status(400).json({ error:'Repositório não encontrado.' });

  repositories.splice(repositoryIndex, 1);

  //sucess porque foi feita uma remoção
  return response.status(204).send();
});



app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params//id que está dentro dos parâmetros
  //encontrar o repository que o id é == ao id que recebo nos parâmetros const {id}
  const repository = repositories.find(repository => repository.id == id)

  if (!repository)
  return response.status(400).json({ error: "Repositório não encontrado." })

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
