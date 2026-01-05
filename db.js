const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on ${port}`));
