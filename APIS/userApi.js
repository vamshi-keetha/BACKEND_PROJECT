const exp=require("express")
const expressAsyncHandler = require("express-async-handler")
const userApp=exp.Router()

//import bcrypt 

const bcryptjs=require("bcryptjs")
const { request, response } = require("express")


const jwt=require("jsonwebtoken")

// to extract body from request.http
userApp.use(exp.json())





// create api

// to get all users

userApp.get('/getusers',expressAsyncHandler(async(request,response)=>{
   let usercol=request.app.get("usercollection")

//    get all login users

   let users=await usercol.find().toArray()
   response.send({message:`all users`,payload:users})

}))

userApp.get('/getuser/:id',expressAsyncHandler(async(request,response)=>{
    let usercol=request.app.get("usercollection")
    let userid=(+request.params.id);
    let userdb=await usercol.findOne({userId:userid})

   if(userdb==null){
    response.send({message:`user  not found`})
   }
   else{
    response.send({message:`user found`,payload:userdb})
   }
   
}))



// login to the page

userApp.get('/login',expressAsyncHandler(async(request,response)=>{
  let usercol=request.app.get("usercollection")

  let usercredobj=request.body;
//   verifying the creditials
     let userdb=await usercol.findOne({username:usercredobj.username})

     if(userdb==null){
        response.send({message:`invalid username`})
     }
     else{
        // compare password
        let status=await bcryptjs.compare(usercredobj.password,userdb.password)
        if(status==false){
            response.send({message:`invalid password`})
        }
        else{
            let token=jwt.sign({username:usercol.username},'abcd',{expiresIn:60})

            // send response
            response.send({message:`login success`,payload:token,user:userdb})
        }
     }

}))



// to create a product 

userApp.post('/create-user',expressAsyncHandler(async(request,response)=>{
    let usercoll=request.app.get("usercollection")
    // get userobj from request.http
    let newuser=request.body;
    
    // check for user existance

    let userDB=await usercoll.findOne({username:newuser.username})

    if(userDB!==null){
        response.send({message:`user already exist`})
    }
    else{
        // hash the passwrord
        let hashedpass=await bcryptjs.hash(newuser.password,6);

        // replace plain to hash passsword
        newuser.password=hashedpass

        // insert to database
        await usercoll.insertOne(newuser)

        // send response to client
        response.send({message:`user created successfully`})
    }

}))


// remove an user from users
userApp.delete('/remove-user/:id',(request,response)=>{
    let removeuser=request.params.id;
    users.pop(users[removeuser])
    response.send({message:'user remover',payload:users})
})

// excport user-api

module.exports=userApp;
