const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
const add = async(req,res)=>{
    try {
       // const {userName,password} =req.body;
        const user =await prisma.controller.createMany ({
            data:req.body
        });
        res.json(Created);
        res.status(200).json({
            message:"record inserted successfully",
            Response:user
        })
        
    } catch (error) {
        res.status(400).json({
            message:"record not inserted successfully",
            Response:error.message
        })
    }
}
module.exports ={add}