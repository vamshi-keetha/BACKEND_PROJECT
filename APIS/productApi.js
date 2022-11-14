const { request, response } = require('express')
const exp=require('express')
const expressAsyncHandler = require('express-async-handler')
const productApp=exp.Router()

const expressasynchandler=require('express-async-handler')


productApp.use(exp.json())




// product components

productApp.get('/getproducts',expressasynchandler(async(request,response)=>{
    let productcol=request.app.get("productcollection")

    let products=await productcol.find().toArray()
    response.send({message:`all products`,payload:products})
}))

productApp.get('/getproduct/:id',expressAsyncHandler(async(request,response)=>{
    let productcollection1=request.app.get("productcollection")
    
    let pid=(+request.params.id);
    // search product byy id 
   let product=await productcollection1.findOne({productId:pid})

//    send message
    if(product==null){
        response.send({message:'product not exist'})
    }
    else{
        response.send({message:`product find`,payload:product})
    }
}))

// to create a product 

productApp.post('/create-product',expressasynchandler(async(request,response)=>{
    let productcollection1=request.app.get("productcollection")
    // get productobj from request.http
    let newproduct=request.body;
    let result=await productcollection1.insertOne(newproduct)
    response.send({message:"product created successfully",payload:result})
}))


// updating a product

productApp.put('/update-product',expressAsyncHandler(async(request,response)=>{
    let productcollection1=request.app.get("productcollection")
    let modifiedpro=request.body;

    // updating the product
    await productcollection1.updateOne({productId:modifiedpro.productId},{$set:{...modifiedpro}})

    // send response
    response.send({message:`product modfied`})

}))


// remove an user from users
productApp.delete('/remove-product/:id',expressasynchandler(async(request,response)=>{

    let productcollection1=request.app.get("productcollection")
    let prodid=(+request.params.id);
    await productcollection1.deleteOne({productId:prodid})

    response.send({message:`product deleted successfully`})
   
}))

// export prodct-api

module.exports=productApp;


