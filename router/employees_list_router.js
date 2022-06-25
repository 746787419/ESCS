const express = require('express')
let router = express.Router()
const pool = require('../pool') 

router.get('/employeesList',(req,res)=>{
	// handle()
	console.log(req.query)
	async function handle(){
		try{
			 if(!await selectToken()){
				 res.send({code:201,msg:'未登录'})
				 return
			 }
			 if(await selectUser()){
				 res.send({code:200,})
			 }
		}catch(err){
			res.send({code:111,msg:'数据库错误'})
		}
	}
	function selectUser(){
		return new Promise((resolve,reject)=>{
			pool.query("SELECT * FROM user",(err,result)=>{
				if(err) throw err
				resolve(result)
			})
		})
	}
	function selectToken(){
		return new Promise((resolve,reject)=>{
			pool.query("SELECT count(*) FROM admin_online WHERE token = ?",[req.query.token],(err,result)=>{
				if(err) throw err
				if(result[0]["count(*)"]==0){
					resolve(false)
				}
				if(result[0]["count(*)"]>0){
					resolve(true)
				}
				resolve({code:200,msg:'success',result})
			})
		})
	}
})

module.exports = router