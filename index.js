require("dotenv").config();

const server = require("./server");

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`)
})