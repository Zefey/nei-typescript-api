const qs = require("qs");
const axios = require("axios");
const { resolveConfig } = require("./resolveConfig");

const __config__ = resolveConfig();

axios.defaults.timeout = 30000;
const http = axios.create({
  withCredentials: true,
  headers: {
    Cookie:
      "koa.sid=GhVhjfRx7ryPrljJngTNy5-TiTt872zI;koa.sid.sig=QbyyMslAfuEACx4OA-F4RC3E6Fs;",
    Host: __config__.domain.replace("http://", ""),
    Origin: __config__.domain,
    Referer: __config__.domain + "/",
    "Content-Type": "application/json",
    "sec-ch-ua": `"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"`,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  },
});

http.interceptors.request.use(
  (config) => {
    config.headers.Cookie = config.headers.Cookie || __config__.Cookie || ''
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    const cookies = response.headers['set-cookie']
    // console.log('set-cookies', cookies)
    if(cookies && cookies.length){
      __config__.Cookie = cookies.map(v => v.split(';')[0]).join(';')
    }
    let res = response.data;
    // console.log(res);
    // 提前判断
    return res;
  },
  async (error) => {
    let response = error.response;
    // console.log(response);
    return Promise.reject(response.data);
  }
);
/**
 * 登录
 */
const login = async () => {
  // 登录
  console.log("登录中");
  const res = await http.post(
    `${__config__.domain}/api/login`,
    qs.stringify({
      username: __config__.username,
      password: __config__.password,
    }),
    {
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      }
    }
  );
  // console.log('login ',res)
  console.log("登录成功");
  
  return res;
};
/**
 * 获取项目组
 */
const getProgroups = async () => {
  const res = await http.get(
    `${__config__.domain}/api/progroups`,
  );
  return res.result;
};

/**
 * 获取项目列表
 */
const getProjects = async (pgid) => {
  const res = await http.get(
    `${__config__.domain}/api/progroups/${pgid}`,
  );
  return res.result.projects;
};

/**
 * 获取接口列表
 */
const getInterfaces = async (pid) => {
  const res = await http.get(
    `${__config__.domain}/api/interfaces/?pid=${pid}`,
  );
  return res.result;
};

/**
 * 获取接口
 */
const getInterface = async (id) => {
  const res = await http.get(
    `${__config__.domain}/api/interfaces/${id}`,
  );
  return res.result;
};

/**
 * 获取类型
 */
const getDataTypes = async (pid) => {
  const res = await http.get(
    `${__config__.domain}/api/datatypes/?pid=${pid}`,
  );
  return res.result;
};

/**
 * 获取常量
 */
const getConstraints = async (pid) => {
  const res = await http.get(
    `${__config__.domain}/api/constraints/?pid=${pid}`,
  );
  return res.result;
};

/**
 * 获取整个project数据
 */
const getProjectres = async (toolKey) => {
  const res = await http.get(
    `${__config__.domain}/api/projectres/?key=${toolKey}`,
  );
  return res.result;
};

/**
 * 获取常量
 */
const logout = async () => {
  const res = await http.get(
    `${__config__.domain}/logout`,
  );
  return res.result;
};


module.exports = {
  http,
  login,
  getProgroups,
  getProjects,
  getInterfaces,
  getInterface,
  getDataTypes,
  getConstraints,
  getProjectres,
  logout
};