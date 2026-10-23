const express=require('express');
const app=express();
require('dotenv').config();
const mongoose=require('mongoose');
const PORT = process.env.PORT || 2006;
const User=require('./models/user.model');
// console.log(process.env.PORT);
const bcrypt=require('bcryptjs');

app.use(express.json());

//make connection with mongoDb

(async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL ||  'mongodb://127.0.0.1:27017/crm');

        // I need to have a default ADMIN created here from the begining

        const user=await User.findOne({userId: "admin"});

        if(!user){
            console.log("Admin is not present");

            const admin=await User.create({
            name:'Aakib ali',
            userId:'ali@2006', 
            email:'aakib477@gmail.com',
            userType:'ADMIN',
            password:bcrypt.hashSync("welcome1",8)
        });
        console.log("Admin created:",admin);
        }
        else{
            console.log("Admin user is already present")
        }
    }
    catch(err){
        console.log("ERROR : ",err);
    }
})();


// lets stich the auth route
const auth_route=require('./routes/auth.route');
app.use('/crm/api/v1',auth_route);

// lets stich the user route
const user_route=require('./routes/user.route')
app.use('/crm/api/v1',user_route);

// lets stich tickeks 
const tickets_route=require('./routes/ticket.route');
app.use('/crm/api/v1',tickets_route);


app.listen(PORT, ()=>{
    console.log("server started running");
});