import express from 'express';

const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
  res.send('<h1>Home</h1>');
});
app.get('/listings', (req, res) => {   // rename to fit your project
  res.send('<h1>Item List</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
