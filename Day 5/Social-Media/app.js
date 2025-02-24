const express = require('express');
const app = express();
const sequelize = require("./util/conn");
const route=require("./route/route");
const cookieParser = require("cookie-parser");

const { User,Post,Comment }=require("./models/associate");


app.use(express.json()); 
app.use(cookieParser("cookie_key_12345"));
app.use(route);





(async () => {
    try {
      await sequelize.authenticate(); // Check if the connection works
      console.log('Connection has been established successfully.');

      await sequelize.sync();
      console.log('All models synchronized with the database.'); 

      app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);

    });
} catch (error) {
      console.error('Unable to connect to the database:', error);
}
})();



app.get('/', (req, res) => {
     res.send('Hello, World!');
});