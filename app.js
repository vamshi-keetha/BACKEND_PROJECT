const { application, request, response } = require('express')
const exp=require('express')
const app=exp()
app.use(exp.json())

const mclient=require("mongodb").MongoClient;


// DBurl 

const DBurl="mongodb+srv://vamshi:vamshi@cluster0.xg11bnq.mongodb.net/?retryWrites=true&w=majority";


// connect the mongoDB with DBurl

mclient.connect(DBurl)
.then((client)=>{
    let dbobj=client.db("Backend_1");
    // create collection objects
    let usercollectionobj=dbobj.collection("usercoll")
    let productcollectionobj=dbobj.collection('productcoll')

    // sharing collection objects 
    app.set("usercollection",usercollectionobj)
    app.set("productcollection",productcollectionobj)

    console.log("DB connection success")
})
.catch(err=>console.log("error in DB connection",err))



// import user-api and product-api

const userApp=require('./APIS/userApi')
const productApp=require('./APIS/productApi')

app.use('/user-api',userApp)
app.use('/product-api',productApp)

// handling invalid path

const middleware1=((request,response,next)=>{
    response.send({message:`invalid path`})
    next()
})
app.use(middleware1)

// errror handling
const middleware2=((error,request,response,next)=>{
response.send({message:`${error.message}`})
})

app.use(middleware2)


// assign port number
app.listen(1308,()=>console.log("server is in 1308..."))