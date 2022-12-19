require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const encrypt=require('mongoose-encryption')
const app=express()
const port=3000

app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.set('strictQuery',true)
mongoose.connect('mongodb://127.0.0.1/userDB')

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

mongoose.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password']});
const User=new mongoose.model('User',userSchema)

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    if(User.length===0){
        const newUser=new User({
            email:username,
            password:password
        })
        newUser.save((err)=>{
            if(err){
                console.log(err);
            }else{
                res.render('secrets')
            }
        })
    }
    else{
        User.findOne({email:username},(err,foundUser)=>{
            if(err){
                console.log(err);
            }else if(foundUser){
                    res.render('login')
                }
            else{
                const newUser=new User({
                    email:username,
                    password:password
                })
                newUser.save((err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.render('secrets')
                    }
                })
            }
        })
    }
    
})

app.post('/login',(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render('secrets')
                }
            }else{
                res.render('register')
            }
        }
    })
})







app.listen(port,(req,res)=>{
    console.log(`server running on ${port} port...`);
})