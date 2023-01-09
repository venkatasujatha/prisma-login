const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
const add = async(req,res)=>{
    try {
       
        const user =await prisma.user.create ({
            data:req.body
        });
        //res.json(user);
        res.status(200).json({
            message:"record inserted successfully",
            Response:user
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message:"record not inserted successfully",
            Response:error.message
        })
    }
}
module.exports ={add}