const express = require('express')
const date = require('silly-datetime')
const multiparty = require('multiparty')
const pool = require('../pool') 
let fs = require('fs')
let router = express.Router()


router.post('/updateData', function(req, res) {
let form = new multiparty.Form({
	uploadDir: './images'
})
form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err)
			res.send({
				code: 111,
				msg: 'error：请求数据问题'
			})
			return
		} else {
			dataHandle(fields.uname[0],files.imgData[0].path,fields).then(function(resolve){
				// console.log(resolve)
					res.send({
						code:resolve[0],
						msg:resolve[1]
					})
				}
			)


	// console.log(files.imgData[0].path)
	// console.log(fields)
}
})
})

router.get('/todayMsg',function(req,res){
	let today = date.format(new Date(), 'YYYY_MM_DD')
	pool.query('SELECT * FROM user_msg WHERE day = ?',[today],function(err,result){
		if(err){
			console.log(err)
			res.send({
				code: 111,
				msg: 'error：请求数据问题'
			})
			return
		}
		res.send({
			code:200,
			msg:'success',
			result
		})
	})
})

router.get('/whoNoUpdateToday',function(req,res){
	let today = date.format(new Date(), 'YYYY_MM_DD')
	pool.query('SELECT uid FROM user_msg WHERE day=?',[today],function(err,result){
		if(err) {
			console.log(err)
			return
		}
		if(result.length == 0)	{
			res.send({code:200,msg:'success',result:[]})
			return
		}
		// console.log(result)
		let str = ' '
		for(let i=0;i<result.length;i++){
			if(i!=0) str =str+ ' and '
			str=str+'id!='+result[i].uid
		}
		pool.query('SELECT name FROM user WHERE'+str,function(err,result){
			if(err) {
				console.log(err)
				return
			}
			res.send({code:200,msg:'success',result})
			
		})
		
	})
})


function findUser(uname) {
	return new Promise(function(resolve, reject) {
		pool.query('SELECT id FROM user WHERE name = ?', [uname], function(err, result) {
			if (err) {
				console.log(err)
				resolve([112, 'error：名称数据库查询问题'])
			} else if (result.length == 0) {
				// console.log('不在员工列表')
				resolve([113, 'error：不在员工列表'])
			} else {
				console.log(result)
				resolve(result[0].id);
			}
		})
	})

}

function updateImg(uid, oldPath) {
	return new Promise((resolve, reject) => {
		let today = date.format(new Date(), 'YYYY_MM_DD')
		fs.rename(oldPath, 'public/img/' + uid + '_' + today + '.jpg', function(err) {
			if (err) {
				console.log(err)
				return
			}
			resolve('/img/' + uid + '_' + today + '.jpg')
		})
	})

}

 function insertUserMsg(values){
	 return new Promise(function(resolve, reject){
		let today = date.format(new Date(), 'YYYY_MM_DD')
		// console.log(values)
		pool.query('INSERT INTO user_msg (id,uid,day,tiwen,is_rwm,is_hs,img,uname) VALUES (?,?,?,?,?,?,?,?)',values,function(err,result){
			if(err) {
				console.log(err) 
				resolve([114,'error：插入员工结果数据错误']) 
			}
			resolve([200,'success'])
		}) 
	 })
}

function delTodayMsg(uid,day){
	return new Promise(function(resolve, reject){
		pool.query('DELETE FROM user_msg WHERE uid=? and day=?',[uid,day],(err,result)=>{
			if(err){
				console.log(err)
				resolve([115,'error:删除当日条目出错'])
			}
			resolve(true)
		})
	})
}


async function dataHandle(uname, oldPath,values){
	let udata = await findUser(uname)
	
	if(typeof udata == 'object'){
		// 删除上来的图片
		fs.rm(oldPath,err=>{
			if(err){
				console.log(err)
			}
		})
		return udata
	}
	let newurl =''
	if(typeof udata == 'number'){
		newurl = await updateImg(udata,oldPath)
	}else{
		return [000,'error:未知']
	}
	let today = date.format(new Date(), 'YYYY_MM_DD')
	let isdel  = await delTodayMsg(udata,today)
	if(typeof isdel == 'object'){
		return isdel
	}
	let insertRes=await insertUserMsg([null,udata,today,values.tiwen[0],values.isRwm[0],values.isHs[0],newurl,uname])
		console.log('insertRes:'+insertRes)
	if(typeof insertRes =='object'){
		return insertRes
	}
}

/*以下为获取部门接口*/
router.get('/get_class_item',(req,res)=>{
	pool.query('SELECT * FROM class_list',(err,result)=>{
		if(err){
			console.log(err)
			res.send({code:'111',msg:'获取部门队列错误'})
			return
		}
		res.send({code:200,msg:'success',result})
	})
})

/*以下为获取各部门员工当天提交数据*/
router.get('/get_staff_list_today',(req,res)=>{
	// console.log(req.query)
	let today = date.format(new Date(), 'YYYY_MM_DD')
	pool.query('SELECT * FROM user_msg WHERE uid in (SELECT id FROM user WHERE cid = ?) and day = ?',[req.query.cid,today],(err,result)=>{
		if(err){
			console.log(err)
			res.send({code:'111',msg:'获取各部门员工当天提交数据错误'})
			return
		}
		res.send({code:'200',msg:'success',result})
	})
})

/*以下为各部门当天未提交数据的人员名单*/
router.get('/get_staff_no_updata_today',(req,res)=>{
	let today = date.format(new Date(), 'YYYY_MM_DD')
	pool.query('SELECT name FROM user WHERE id NOT IN (SELECT uid FROM user_msg WHERE uid IN (SELECT id FROM user WHERE cid = ?) AND day = ?) AND cid = ?',[req.query.cid,today,req.query.cid],(err,result)=>{
		if(err) {
			console.log(err)
			res.send({code:'111',msg:'查询当天未提交数据的人员名单错误'})
			return
		}
		res.send({code:'200',msg:'success',result})
	})
})
module.exports = router
