const express = require("express");

const server = express();

server.use(express.json());

const projects = [
  { id: "1", title: "teste", task: ["muitas coisas para fazer"] }
];
var count = 0;

server.use((req, res, next) => {
  console.log(`Quantidade de req: ${count++}`);
  return next();
});

server.get("/projects", (req, res) => {
  return res.status(200).json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, task: [] });

  return res.status(201).json(projects);
});

function checkId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  next();
}

server.put("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;

  projects.map(project => {
    if (project.id === id) return (project.title = req.body.title);
  });

  return res.json(projects);
});

server.delete("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(project => {
    if (project.id === id) return project.task.push(title);
  });

  return res.json(projects);
});

server.listen(3000);
