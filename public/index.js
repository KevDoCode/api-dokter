const app = require("../App/App");
const port = 30;
app.listen(port, () => {
  console.log(`REST at http://localhost:${port}`);
});
