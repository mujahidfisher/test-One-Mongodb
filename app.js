const express = require('express')
const app = express()
const port = 3000
app.listen(port, () => {
    console.log(`The server is running on port : ${port}👌`);
})

// routes
app.get('/books', (req, res) => {
    res.json({msg: "success"})
})