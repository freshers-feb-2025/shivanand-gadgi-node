const User=require("./user");
const Post=require("./post");
const Comment=require("./comment");



User.hasMany(Post);
Post.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Comment);
User.hasMany(Comment);


module.exports = { User, Post, Comment};