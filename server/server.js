// start server nodejs
const app = require("./src/app");

const PORT = 3540;
const server = app.listen(PORT, () => {
  console.log(`Classroom Management start with port ${PORT} `);
});
