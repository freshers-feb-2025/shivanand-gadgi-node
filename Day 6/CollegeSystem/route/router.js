const express=require("express");
const router=express.Router();
const Student=require("../models/student");
const Teacher=require("../models/teacher");
const User=require("../models/User");




router.post("/register", async (req, res) => {

    const { name, email, role, age, subject } = req.body;
   // const user = await User.create({ name, email, role });

   try{

    
        switch (role) {
          case 'student':
            await Student.create(

                { 
                    age,
                    user:{
                        name,
                        email,
                        role,
                    },

                },
                {
                    include: [{model:User,as:"user"}],
                }
            
            );

            break;
          case 'teacher':
            await Teacher.create({ 
                subject,
                user:{
                    name,
                    email,
                    role,
                },

            },
            {
                include: [{model:User,as:"user"}],
            });
            break;
          default:
            return res.status(400).json({ error: 'Invalid role' });
        }
    

        res.status(201).json({ message: 'User registered successfully' });
    

       
    } catch (err) {
        res.status(404).json({ error : "Something went wrong"});
    }
});

router.get("/users", async (req, res) => {
    try {
        const users = await User.findAll({ include: [{ model: Student }, { model: Teacher }] });
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error : "Something went wrong"});
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { include: [{ model: Student }, { model: Teacher }] });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error : "Something went wrong"});
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        const { name, email, role, age, subject } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.update({ name, email, role });

        switch(role)
        {
            case "student":
                const student=await Student.findOne({ where: { id: user.id } });
                await student.update({ age });
                break;
            case "teacher":
                const teacher=await Teacher.findOne({ where: { id: user.id } });
                await teacher.update({ subject });
                break;
            default:
                return res.status(400).json({ error: 'Invalid role' });
        }
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(404).json({ error : "Something went wrong"});
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(404).json({ error : "Something went wrong"});
    }
});




module.exports=router;


