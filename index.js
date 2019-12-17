const express=require('express')
const app=express()
const hbs=require('hbs')
const path=require('path')
var request = require('request');
const { MongoClient } = require('mongodb')

const client = new MongoClient('mongodb://localhost:27017')

const getDB = dbName =>
  client.connect()
    .then(() => client.db(dbName))
    .catch(err => console.log(err))

app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

hbs.registerPartials(path.join(__dirname,'/partials'))

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.render('index')
})

// app.post('/run',(req,res)=>{
//     console.log("Via run"+req.body);
    // var program = {
    //     script : req.body.ta,
    //     language: req.body.lang,
    //     versionIndex: "3",
    //     clientId: "7b2e69b52175091d3b1f6e599594004e",
    //     clientSecret:"823b6b2082d962f5b0fd0a747300dbed230bfea00d8fc02d647f88b980779ee3"
    // };
    // request({
    //     url: 'https://api.jdoodle.com/v1/execute',
    //     method: "POST",
    //     json: program
    // },
    // function (error, response, body) {
    //     if(error) console.log('error:', error);
    //     //console.log('statusCode:', response && response.statusCode);
    //     else console.log(body);
    //     var ta=document.getElementById('exampleFormControlTextarea1')
    //     ta.innerText=body.output
    //     res.redirect('/');
    // });
    // var ta=document.getElementById('exampleFormControlTextarea1')
    // ta.innerText="hello";
    // res.redirect('/')
// })

// app.post('/submitcode',(req,res)=>{
//     console.log("Via submit code"+req.body);
    // getdb(testdb).then(db=>{
    //     const codes=db.collection('codes')
    //     codes.insertOne({
    //         name: ,
    //         srcCode:
    //     }).then(result=>console.log(result))
    // })
    
// })

app.post('/saveas',(req,res)=>{
    const code=req.body.ta
    console.log(req.body);
    getDB('testdb').then(db=>{
            const codes=db.collection('codes')
            codes.insertOne({
                name: req.body.filename,
                srcCode:code,
            }).then(result=>{
                    console.log(result.ops)
                    var program = {
                        script : req.body.ta,
                        stdin:req.body.ip,
                        language: req.body.lang,
                        versionIndex: "3",
                        clientId: "7b2e69b52175091d3b1f6e599594004e",
                        clientSecret:"823b6b2082d962f5b0fd0a747300dbed230bfea00d8fc02d647f88b980779ee3"
                    };
                    request({
                        url: 'https://api.jdoodle.com/v1/execute',
                        method: "POST",
                        json: program
                    },
                    function (error, response, body) {
                        if(error) console.log('error:', error);
                        //console.log('statusCode:', response && response.statusCode);
                        else console.log(body);
                        res.send(body.output);
                    })
            })
        })
})

// app.post('/save',(req,res)=>{
//     console.log(req.body);
// })





app.listen(3000)