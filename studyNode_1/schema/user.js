/*
 * @Author: hejiasu-iHealth CN 37732924@qq.com
 * @Date: 2022-05-10 14:38:27
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @LastEditTime: 2022-05-19 15:17:04
 * @FilePath: /demo/schema/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


// 导入定义验证规则的包
const joi = require('@hapi/joi')

// 定义用户名和密码的验证规则
/*
    string() 值必须是字符串
    alphanum() 值只能是包含 a-z A-Z 0-9 的字符串
    min（length）最小长度
    max（length）最大长度
    required() 值是必须项，不能为 undefined
    pattern(正则表达式) 值必须符合正则表达式的规则
*/
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password,
    },
}

// 定义 id、nickname、email 的验证规则
const user_id = joi.number().integer().min(1).required()
const user_nickname = joi.string().required()
const user_email = joi.string().email().required()

// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {

    // 需要对 req.body 里面的数据进行验证
    body: {
        id: user_id,
        nickname: user_nickname,
        email: user_email
    },
}

// 验证规则对象 - 更新密码
exports.update_password_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,

        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这俩条验证规则
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    },
}



// 验证规则对象 - 更换头像

// dataUri() 指的是如下格式的字符串数据
// data：image/png; base64. VE9PTUFOWVNFQ1JFVFM=
const userinfo_avatar = joi.string().dataUri().required()

// 验证规则对象 - 更换头像
exports.update_avatar_schema = {
    body: {
        avatar: userinfo_avatar
    },
}