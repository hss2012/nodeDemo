/*
 * @Author: hejiasu-iHealth CN 37732924@qq.com
 * @Date: 2022-05-17 16:53:15
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @LastEditTime: 2022-05-19 15:17:57
 * @FilePath: /demo/router/userinfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 导入 express
const express = require('express')

// 创建路由对象
const router = express.Router()

const userinfo_handler = require('../router_handler/userinfo')


// 1、导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

// 2. 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 更新密码的路由
router.post('/updatepwd',expressJoi(update_password_schema), userinfo_handler.updatePassword)
//更新用户头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)

// 向外共享路由对象
module.exports = router