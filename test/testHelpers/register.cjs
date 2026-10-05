/** @type {typeof import('@babel/register')} */
const { default: register } = require("@babel/register");
register({ extensions: [".js", ".ts", ".tsx"] });
