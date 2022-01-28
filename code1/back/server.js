const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('../front'))

const PORT = 5000;

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}.`)
})
