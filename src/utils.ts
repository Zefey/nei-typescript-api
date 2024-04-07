// 字符串转大驼峰
export const toUpperCamelCase = (str: string) => {
  return str
    .replace(/_[a-z]/g, (m) => m[1].toUpperCase())
    .replace(/^[a-z]/, (m) => m.toUpperCase());
};

// 字符串转小驼峰
export const toLowerCamelCase = (str: string) => {
  return str
    .replace(/_[a-z]/g, (m) => m[1].toUpperCase())
    .replace(/^[A-Z]/, (m) => m.toLowerCase());
};
