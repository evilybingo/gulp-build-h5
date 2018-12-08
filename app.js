const express = require('express')
const path = require('path')
const app = new express()

app.use(express.static(path.join(__dirname, 'src/agreement/dist/')));
app.set('views', path.join(__dirname, '/src/agreement/dist/'));

app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
res.set({'Content-type': 'text/html'})
res.render('share')
})

app.listen(3019,function(){
    console.log("start server...");
})




