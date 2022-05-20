/*
 * @Author: your name
 * @Date: 2022-04-26 15:01:25
 * @LastEditTime: 2022-05-17 15:38:42
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /demo/router_handler/user.js
 */

// 定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用


const db = require('../db/index')

const bcrypt = require('bcryptjs')
const { result, concat } = require('@hapi/joi/lib/base')
const { use } = require('express/lib/application')

// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册用户的处理函数
exports.reguser = (req, res) => {

    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body
    
    // 对表单中的数据，进行合法性的校验
    // if (!userinfo.username || !userinfo.password){
    //     return res.send({
    //         status: 1,
    //         message: '用户名或密码不能为空'
    //     })
    // }

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr =  'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results)=>{

        // 执行 SQL 语句失败
        if(err){
            // return res.send({
            //     status:1,
            //     message: err.message
            // })

            return res.cc(err.message)
        }

        // 判断用户名是否被占用
        if(results.length > 0){
            // return res.send({
            //     status: 1,
            //     message:'用户名被占用，请更换其他用户名'
            // })
            return res.cc('用户名被占用，请更换其他用户名')
        }

        // 用户名可以使用。。。

        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password,10)   


        // 定义插入新用户的 SQL 语句
        const sql = 'insert into ev_users set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, {username: userinfo.username, password:userinfo.password} , (err, results) => {
            
            // 判断 SQL 语句是否执行成功
            // if(err) return res.send({
            //     status: 1,
            //     message: err.message
            // })

            if(err) return res.cc(err.message)

            // 判断影响行数是否为 1
            // if (results.affectedRows != 1){
            //     return res.send({
            //         status: 1,
            //         message:'注册用户失败，请稍后再试'
            //     })
            // }

            if (results.affectedRows != 1){
                return res.cc('注册用户失败，请稍后再试')
            }


            // res.send({
            //     status:0,
            //     message:'注册成功'
            // })
            res.cc('注册成功', 0)

        })

    })

    console.log(userinfo)

    // res.send('reguser ok')
    
}

// 用户登录的处理函数
exports.login = (req, res) => {
    
    // 接收表单数据
    const userInfo  = req.body
    
    // 定义 SQL 语句
    const sql = 'select * from ev_users where username=?'
    
    // 执行 SQL 语句，根据用户名查询用户的信息
    db.query(sql, userInfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)

        // 执行 SQL 语句成功，但是获取到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！')

        // TODO: 判断密码是否正确
        // 拿着用户输入的密码，和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)

        // 如果对比的结果是 false 则证明用户密码不对
        if (!compareResult){
            return res.cc('登录失败')
        }


        // TODO: 在服务器生成 Token 的字符串
        const user = {...results[0], password: '', user_pic:''}
        // 对用户信息进行加密，生成 Token 字符串
        const tonkenStr = jwt.sign(user,config.jwtSecretKey, { expiresIn: config.expiresIn})
        
        // 调用 res.send() 将 Token 响应给客户端
        res.send({
            status:0,
            message:'登录成功',
            token:'Bearer ' + tonkenStr
        })

    })
}