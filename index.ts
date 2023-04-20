import sequelize from "./model/db"
import app from "./controller/user"

const port = 8000

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.get("/", (req, res) => {
    res.send("It works")
})