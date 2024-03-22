// 字符串转大驼峰
const toUpperCamelCase = (str) => {
  return str.replace(/_[a-z]/g, m => m[1].toUpperCase()).replace(/^[a-z]/, m => m.toUpperCase());
}

// 字符串转小驼峰
const toLowerCamelCase = (str) => {
  return str.replace(/_[a-z]/g, m => m[1].toUpperCase()).replace(/^[A-Z]/, m => m.toLowerCase());
}

module.exports = {
  toUpperCamelCase,
  toLowerCamelCase
}