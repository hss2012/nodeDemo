/*
 * @Author: your name
 * @Date: 2022-04-25 09:45:04
 * @LastEditTime: 2022-05-18 09:16:25
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /demo/app.js
 */


const express= require('express')
const app = express()


// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())


// 配置解析表单中数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false}))

// 响应数据的中间件
app.use((req, res, next) => {
    // status = 0 为成功， status = 1 为失败，默认将 status 的值设置为 1， 方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 描述信息，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err
        })
    }

    next()
})

var { expressjwt: expJWT } = require("express-jwt");
const config = require('./config')
app.use(
    expJWT({
      secret: config.jwtSecretKey,
      algorithms: ["HS256"],
    }).unless({ path:[/^\/api\//] })
)


// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息的路由模块
const userInfoRouter = require('./router/userinfo')
app.use('/my', userInfoRouter)



const joi = require('@hapi/joi')
// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    //
    // 未知的错误
    res.cc(err)
})




// 启动服务器
app.listen(3007, () => {
    console.log('启动服务器 http://127.0.0.1:3007')
})