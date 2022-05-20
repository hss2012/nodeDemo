/*
 * @Author: hejiasu-iHealth CN 37732924@qq.com
 * @Date: 2022-05-18 09:25:56
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @LastEditTime: 2022-05-19 15:33:27
 * @FilePath: /demo/router_handler/userinfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


// 导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req,res) => {
    
    // 定义查询用户信息的 SQL 语句
    const sql = `select id, username, niekname, email, user_pic from ev_users where id=?`
    
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,req.auth.id, (err, results) => {

        // 执行 SQL 语句失败
        if(err) return res.cc(err)

        // 执行 SQL 语句成功，但是查询的结果可能为空
        if(results.length !== 1) return res.cc('获取用户信息失败')

        // 用户信息获取成功
        res.send({
            status:0,
            message:'获取用户信息成功',
            data: results[0]
        })
    })
}


exports.updateUserInfo = (req, res) => {
    // res.send('ok')

    const sql = `update ev_users set ? where id=?`

    db.query(sql, [req.body, req.body.id], (err, results) => {

        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但影响行数不为1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败')

        // 修改用户信息成功
        return res.cc('修改用户基本信息成功')
    })
}


// 更新用户修改密码的处理函数
exports.updatePassword = (req, res) => {

    // 定义根据 id 查询用户数据的 SQL 语句
    const sql = `select * from ev_users where id=?`

    // 执行 SQL 语句查询用户是否存在
    db.query(sql, req.auth.id, (err, results) => {

        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在')     
        

        // 判断密码是否正确(不能使用等号判断密码是否正确，因为数据库存储的密码是加密过后的)

        // 在头部区域导入 bcryptjs 后,即可使用 bcryptjs.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，ture 表示密码正确，false 表示密码错误

        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误')

        // 定义更新用户密码的 SQL 语句
        const sql = 'update ev_users set password=? where id=?'

        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        db.query(sql, [newPwd, req.auth.id], (err, results) => {

            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL语句执行成功，但是影响行数不等于 1 
            if (results.affectedRows !== 1) return res.cc('更新密码失败')
            
            // 更新密码成功
            res.cc('更新密码成功', 0)
        })

    })
}


// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    

    const sql = 'update ev_users set user_pic=? where id=?'

    db.query(sql,[req.body.avatar, req.auth.id], (err, results) => {

         // 执行 SQL 语句失败
         if (err) return res.cc(err)

         // SQL语句执行成功，但是影响行数不等于 1 
         if (results.affectedRows !== 1) return res.cc('更新头像失败')
            
         // 更新用户头像成功
         res.cc('更新用户头像成功', 0)
    })
}