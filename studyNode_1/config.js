/*
 * @Author: hejiasu-iHealth CN 37732924@qq.com
 * @Date: 2022-05-17 15:03:40
 * @LastEditors: hejiasu-iHealth CN 37732924@qq.com
 * @LastEditTime: 2022-05-17 15:40:28
 * @FilePath: /demo/config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


// 这是一个全局的配置文件

module.exports = {
    // 加密和解密 Token 的秘钥
    jwtSecretKey: 'studyNode.',
    // Token 的有效期
    expiresIn: '10h'
}