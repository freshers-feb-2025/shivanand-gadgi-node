const express = require('express');
const app = express();
const sequelize = require("./util/database");
const router=require("./route/route");


const { Customer, Order, Item, Profile }=require("./models/associate");

let customerQueryObject=null;
let item1,item2,item3;

app.use(express.json()); 
app.use(router);

(async () => {
    try {
      await sequelize.authenticate(); // Check if the connection works
      console.log('Connection has been established successfully.');

      await sequelize.sync({force: true});//Dont use force in production instead use alter 
      console.log('All models synchronized with the database.'); // Sync models with the database
      //ok, here we need to always sync model with db before starting server

      item1=await Item.create({name:"Burger",price:"100"});
      item2=await Item.create({name:"Pizza",price:"200"});
      item3=await Item.create({name:"Coke",price:"50"});

      
      customerQueryObject=await Customer.create({name:"Prem Gadgi",email:"premgadgi@gmail.com"});
      //Customer.hasMany(Order); So we can insert multiple order records of same customer
      await customerQueryObject.addItem(item1);
      await customerQueryObject.addItem(item3);
      await customerQueryObject.createOrder({total:100});
      await customerQueryObject.createOrder({total:150});
      await customerQueryObject.createProfile({address: "MIDC,Solapur", phone: "9834929551"});
     

      customerQueryObject=await Customer.create({name:"Shivanand Gadgi",email:"shivanandgadgi@gmail.com"});
      await customerQueryObject.addItem(item1);
      await customerQueryObject.createOrder({total:100});
      await customerQueryObject.createProfile({address: "MIDC,SOlapur", phone: "9876543654"});

      customerQueryObject=await Customer.create({name:"Arjun Dhulam",email:"arjundhulam@gmail.com"});
      await customerQueryObject.addItem(item2);
      await customerQueryObject.createOrder({total:200});
      await customerQueryObject.createProfile({address: "Navi Peth,Solapur", phone: "9876543289"});

      customerQueryObject=await Customer.create({name:"Naveen Dhulam",email:"naveendhulam@gmail.com"});
      await customerQueryObject.addItem(item2);
      await customerQueryObject.addItem(item3);
      await customerQueryObject.createOrder({total:200});
      await customerQueryObject.createOrder({total:50});
      await customerQueryObject.createProfile({address: "Navi Peth,Solapur", phone: "9876542198"});

      console.log("Customers created with their orders.");

    

      //await Order.create({total:2000});
      
      

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