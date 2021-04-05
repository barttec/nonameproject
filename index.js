const express = require('express');
const app = express();
app.use(express.static('.')); // this serves all files from the -public- directory
const port = process.env.PORT || 8000; // this is important for heroku
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:` + port);
});