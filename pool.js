const mysql = require('mysql')
let pool = mysql.createPool({//上线修改数据库用户密码
	host: 'localhost',
	user: 'root',
	password: '',
	port: '3306',
	database: 'styq'
})

module.exports = pool