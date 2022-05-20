/*
 * @Author: your name
 * @Date: 2022-04-26 14:40:15
 * @LastEditTime: 2022-05-12 14:48:25
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /demo/router/user.js
 */


const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数的对应的模块
const userHandler = require('../router_handler/user')


// 1、导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')



// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema) , userHandler.reguser)

// 用户登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

// 将路由对象共享出去
module.exports = router