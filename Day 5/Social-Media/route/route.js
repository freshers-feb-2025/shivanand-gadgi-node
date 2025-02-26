const express=require("express");
const bcrypt = require("bcryptjs");
const router=express.Router();
const User=require("../models/user");
const Post=require("../models/post");
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
         const token = req.signedCookies["auth_token"]; 
 
         if (!token) return res.status(401).json({ error: "Unauthorized! Please log in." });

         jwt.verify(token, "mysecretkey12345", (err, decoded) => {
             if (err) return res.status(401).json({ error: "Invalid token!" });
             req.user = decoded; 
             next();
         });
 };

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(404).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, "mysecretkey12345", { expiresIn: "1h" });
        res.cookie("auth_token", token, {
            httpOnly: true, 
            secure: false,
            signed: true,
            maxAge: 3600000, 
        });

        res.json({ message: "Login successful!", user: req.user });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(404).json({ error: "Internal server error" });
    }
});

router.post("/logout", (req, res) => {

    const token = req.signedCookies["auth_token"];
    if (!token) {
        return res.status(400).json({ error: "You are not logged in!" }); 
    }
    res.clearCookie("auth_token"); 
    res.json({ message: "Logout successful!" }); 
});

//----------------------------------------------------------------------------------------

router.post("/post", isAuthenticated, async (req, res) => {

    try {
        const { title, content } = req.body;
        const email = req.user.email; 

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required." });
        }

        const user = await User.findOne({ where: { email } });

        const newPost = await user.createPost({
            title,
            content,
        });

        res.status(201).json({ message: "Post created successfully!", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal server error" });
    }

    
});

router.get("/getAllPost", isAuthenticated,async (req, res) => {
    try {

        const id=req.user.id;

        const posts = await Post.findAll({
            where:{id}
        });

        res.json({ message: "Posts fetched successfully!", posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});

router.get("/post/:postId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id; 
        const { postId } = req.params; 

       
        const post = await Post.findOne({
            where: { id: postId, userId }, 
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found or unauthorized!" });
        }
        res.json({ message: "Post fetched successfully!", post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});

router.delete("/post/:postId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params; 

        const post = await Post.findOne({ where: { id: postId, userId } });

        if (!post) {
            return res.status(404).json({ error: "Post not found or unauthorized!" });
        }

        await post.destroy();

        res.json({ message: "Post deleted successfully!" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});





module.exports=router;