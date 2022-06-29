const express = require('express')
let router = express.Router()
const pool = require('../pool')

router.get('/employeesList', (req, res) => {
	handle()
	async function handle() {
		try {
			if (!await selectToken(req.query.token)) {
				res.send({
					code: 201,
					msg: '未登录'
				})
				return
			}
			let result = await selectUser(req.query.cid)
			res.send({
				code: 200,
				msg: 'success',
				result
			})
		} catch (err) {
			console.log(err)
			res.send({
				code: 111,
				msg: '数据库错误'
			})
		}
	}

	function selectUser(cid) {
		return new Promise((resolve, reject) => {
			pool.query("SELECT * FROM user WHERE cid = ?", [cid], (err, result) => {
				if (err) throw err
				resolve(result)
			})
		})
	}

})

router.post("/del_emp", (req, res) => {
	// 删除员工 uid token
	handle()
	async function handle() {
		try {
				console.log(req.body.token)
			if (!await selectToken(req.body.token)) {
				res.send({
					code: 201,
					msg: '未登录'
				})
				return
			}
			if (await delUser()) res.send({
				code: 200,
				msg: "success"
			})
			else res.send({
				code: 202,
				msg: "删除了不存在的内容"
			})
		} catch (err) {
			console.log(err)
			res.send({
				code: 111,
				msg: "数据库错误"
			})
		}
	}

	function delUser() {
		return new Promise((resolve, reject) => {
			pool.query("DELETE FROM user WHERE id=?", [req.body.uid], (err, result) => {
				if (err) throw err
				if (result.affectedRows > 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}
})

router.post("/del_class", (req, res) => {
	//删除分类 cid
	handle()
	async function handle() {
		try {
			if (!await selectToken(req.body.token)) {
				res.send({
					code: 201,
					msg: '未登录'
				})
				return
			}
			await delClassUser()
			if (await delClass()) {
				res.send({
					code: 200,
					msg: "success"
				})
			} else {
				res.send({
					code: 202,
					msg: '删除了不存在内容'
				})
			}
		} catch (err) {
			console.log(err)
			res.send({
				code: 111,
				msg: "数据库错误"
			})
		}
	}

	function delClassUser() {
		return new Promise((resolve, reject) => {
			pool.query('DELETE FROM user WHERE cid=?', [req.body.cid], (err, result) => {
				if (err) throw err
				if (result.affectedRows > 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}

	function delClass() {
		return new Promise((resolve, reject) => {
			pool.query("DELETE FROM class_list WHERE id = ?", [req.body.cid], (err, result) => {
				if (err) throw err
				if (result.affectedRows > 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}
})

router.post('/add_class', (req, res) => {
	//添加分类
	handle()
	async function handle() {
		try {
			if (!await selectToken(req.body.token)) {
				res.send({
					code: 201,
					msg: '未登录'
				})
				return
			}
			if(await addClass()){
				res.send({
					code: 200,
					msg: 'success'
				})
			}else{
				res.send({
					code: 202,
					msg: '未知错误'
				})
			} 
		} catch (err) {
			console.log(err)
			res.send({
				code: 111,
				msg: "数据库错误"
			})
		}
	}
	function addClass(){
		return new Promise((resolve,reject)=>{
			pool.query("INSERT INTO class_list SET name = ?",[req.body.cname],(err,result)=>{
				if(err) throw err
				if (result.affectedRows > 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}
})

router.post('/add_emp', (req, res) => {
	//添加员工
	handle()
	async function handle() {
		try {
			if (!await selectToken(req.body.token)) {
				res.send({
					code: 201,
					msg: '未登录'
				})
				return
			}
			if(await addClass()){
				res.send({
					code: 200,
					msg: 'success'
				})
			}else{
				res.send({
					code: 202,
					msg: '未知错误'
				})
			} 
		} catch (err) {
			console.log(err)
			res.send({
				code: 111,
				msg: "数据库错误"
			})
		}
	}
	function addClass(){
		return new Promise((resolve,reject)=>{
			pool.query("INSERT INTO user SET name = ?,cid = ?",[req.body.uname,req.body.cid],(err,result)=>{
				if(err) throw err
				if (result.affectedRows > 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}
})

router.post('/tokenTest',(req,res)=>{
	try{
		selectToken(req.body.token).then(result=>{
			res.send({
				code:200,
				msg:'success',
				isLogin:result
			})
		})
	}catch(err){
		console.log(err)
		res.send({
			code: 111,
			msg: "数据库错误"
		})
	}
})

function selectToken(token) {
	return new Promise((resolve, reject) => {
		pool.query("SELECT count(*) FROM admin_online WHERE token = ?", [token], (err, result) => {
			if (err) throw err
			if (result[0]["count(*)"] == 0) {
				resolve(false)
			}
			if (result[0]["count(*)"] > 0) {
				resolve(true)
			}
		})
	})
}
module.exports = router
