const express = require('express')

const cors = require('cors') //跨域中间件 上线不用


let hs_upload_and_show_router = require('./router/hs_upload_and_show_router')
let login_router = require('./router/login_router')
let employees_list_router = require("./router/employees_list_router")

let server = express()
server.listen(8086)
server.use(cors())  //跨域中间件 上线不用

server.use(express.urlencoded({
	extended: false
}))
server.use(express.json())
server.use(express.static('./public'))

server.use(hs_upload_and_show_router)
server.use(login_router)
server.use(employees_list_router)