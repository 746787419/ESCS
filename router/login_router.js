const express = require('express')
const nodeRSA = require('node-rsa')
const md5 = require("md5-node")
const date = require('silly-datetime')
let router = express.Router()
let mkey = new rsaKey(new nodeRSA({b: 512}))
const pool = require('../pool') 

router.get('/login_public_key',(req,res)=>{
	// console.log(mkey.getPublicKey())
	res.send({code:200,msg:"success",result:mkey.getPublicKey('public')})
})
/*开发使用 上线不开放*/
router.post('/resgiter',(req,res)=>{	//管理员注册
	let rsaUsername = req.body.username
	let rsaPassword = req.body.password
	let rsaSuPassword = req.body.suPassword
	rsaUsername = rsaUsername.replaceAll(" ","+")
	rsaPassword = rsaPassword.replaceAll(" ","+")
	rsaSuPassword = rsaSuPassword.replaceAll(" ","+")
	let user = {username: mkey.decryptData(rsaUsername),
	password:mkey.decryptData(rsaPassword)}
	console.log(user)
	pool.query('SELECT count(*) FROM super_password WHERE password = ?',[mkey.decryptData(rsaSuPassword)],(err,result)=>{
		if(err){
			console.log(err)
			res.send({code:111,msg:"数据库错误"})
			return
		}
		if(result[0]['count(*)'] == 0){
			res.send({code:202,msg:"超密错误"})
			return
		}
		pool.query('INSERT INTO admin SET ?',user,(err,result)=>{
			console.log(err?err:result)
			if(err){
				if(err.code == 'ER_DUP_ENTRY') {
					res.send({code:201,msg:'用户已存在'}) 
				}else {
					console.log(err)
					res.send(err)
				}
				return
			}
			 res.send({code:200,msg:'success'})
		})
	})
})
/*不开放结束*/

/*登录*/
router.post('/login',(req,res)=>{	//管理员登录
	let rsaUsername = req.body.username
	let rsaPassword = req.body.password
	rsaUsername = rsaUsername.replaceAll(" ","+")
	rsaPassword = rsaPassword.replaceAll(" ","+")
	let token = getToken(mkey.decryptData(rsaUsername),mkey.decryptData(rsaPassword))
	console.log(token)
	// res.send()
	loginHandle()
	async function loginHandle(){
		try{
			let isAd = await isAdmin()
			if(!isAd){
				res.send({code:201,msg:'用户名或密码错误'})
				return
			}
			let isLo = await isLogin()
			let isFinish = isLo?await updateToken():await createToken()
			if(isFinish) res.send({code:200,msg:'success',token:token})
		}catch(err){
			res.send({code:111,msg:'数据库错误'})
		}
	}
	function updateToken(){
		return new Promise((resolve,reject)=>{
			pool.query('UPDATE admin_online SET token = ? WHERE aname = ?',[token,mkey.decryptData(rsaUsername)],(err,result)=>{
				if(err) throw err
				resolve(true)
			})
		})
	}
	function createToken(){
		return new Promise((resolve,reject)=>{
			pool.query('INSERT INTO admin_online SET ?',{token,aname:mkey.decryptData(rsaUsername)},(err,result)=>{
				if(err) throw err
				resolve(true)
			})
		})
	}
	function isAdmin(){
		return new Promise((resolve, reject)=>{
			pool.query("SELECT count(*) FROM admin WHERE username = ? AND password = ?",[mkey.decryptData(rsaUsername),mkey.decryptData(rsaPassword)],(err,result)=>{
				if(err) throw err
				// console.log(result[0]['count(*)'])
				if(result[0]['count(*)'] == 0){
					resolve(false)
					return
				}
				resolve(true)
			})
		})
	}
	function isLogin(){
		return new Promise((resolve, reject)=>{
			pool.query("SELECT count(*) FROM admin_online WHERE aname = ?",[mkey.decryptData(rsaUsername)],(err,result)=>{
				if(err) throw err
				if(result[0]['count(*)'] == 0){
					resolve(false)
				}
				if(result[0]['count(*)'] > 0){
					resolve(true)
				}
			})
		})
	}
})
/*登录结束*/

/*登出*/
router.post('/logout',(req,res)=>{
	pool.query("DELETE FROM admin_online WHERE token = ?",[req.body.token],(err,result)=>{
		if(err){
			console.log(err)
			res.send({code:111,msg:'数据库错误'})
			return
		}
		console.log(result)
		if(result.affectedRows>0){
			res.send({code:200,msg:'登出成功'})
		}else{
			res.send({code:201,msg:'已经登出或在其他地方已登录'})
		}	
	})
})
/*已登出*/

//闭包封装rsa密钥对
function rsaKey(key){
		key.setOptions({encryptionScheme: 'pkcs1'})
	return {
		getPublicKey(){
			return key.exportKey('public')
		},
		decryptData(encrypt){
			return key.decrypt(encrypt, 'utf8')
		}
	}
}

function getToken(username,password){
		let theTime = date.format(new Date(), 'YYYY_MM_DD_HH_mm_ss')
		// console.log(theTime)
		let npwd = ''
		for(let i=password.length-1;i>=0;i--){
			npwd+=password[i]
		}
		npwd=npwd.substring(0,10)
		// console.log(password,npwd)
		return md5(username+npwd+(+new Date()))
}


module.exports = router