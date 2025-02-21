const Customer=require("./customer");
const Order=require("./order");
const Item=require("./item");
const Profile=require("./profile");


Customer.hasMany(Order);//This automatically creates a customer ID column as foreign key inside order table that connects Id column of customer table which is Primary key
Customer.hasOne(Profile);//This automatically creates a customer ID column
//  as foreign key inside profile table that connects Id column of customer table which is Primary key
Customer.belongsToMany(Item, { through: 'CustomerItem' });
//Here What happens is in background a Sequelize  automatically creates Junction table CustomerItem and now this 
//contains two columns cutsomerID and itemID as foreign key refrencing to customerID of Customer table and itemID of Item Table                      
Item.belongsToMany(Customer, { through: 'CustomerItem' });



module.exports = { Customer, Order, Item, Profile };