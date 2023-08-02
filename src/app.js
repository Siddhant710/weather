const path = require('path');
const express = require('express');
const request = require('request');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const app = express();
const port = process.env.PORT || 5556;
const publicDirectoryPath = path.join(__dirname,'../public');
const partialPath = path.join(__dirname,'../templates/partials');

app.set('views', path.join(__dirname, '../templates/views'));
app.set('view engine' , 'hbs');
app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialPath)

app.get('' ,(req,res)=>{
    res.render('index' ,{
        title : "WeatherLive",
        name : "Siddhant Saha",
    });
})


app.get('/weather' , (req,res)=>{
    if(!req.query.address){
        return res.send({
            error :"Must Provide an address",
        });
    }
    geocode(req.query.address , (error,data) =>{
        if(error){
            return res.send({
                error : error,
            })
        }
        forecast([data.latitude,data.longitude] , (error,message)=>{
            if(error){
                return res.send({
                    error : error,
                })
            }
            return res.send({
                message : `It feels like ${message.message} and the temperature is ${message.temperature} .`,
                greet : `Thanks for using the service . See you soon....`,
                location : message.name
            })
        })
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
        title : "About Me",
        name : "Siddhant Saha"
    })
})

app.get('/help',(req,res)=>{
    res.render("help",{
        title : "Help",
        name :"Siddhant Saha",
        message : "For any queries feel free to contact me. Deatils are provided in the about section of the website. Thanks for visiting see you soon........"
    });
})



app.get('*',(req,res)=>{
    res.render('404error',{
        message : "Cant Reached!!!.....",
        title : "404 Error",
        name : "Siddhant Saha",
    });
})

app.listen(port, ()=>{
    console.log(`listening at ${port} port`);
})
