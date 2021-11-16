const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('../front'))

app.get('/say-hi', (req,res)=>{
  console.log('Hi')
  res.status(200).end();
})

const PORT = 5000;

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}.`)
})
