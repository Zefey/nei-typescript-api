import qs from "qs";
import axios from "axios";
import { resolveConfig } from "./resolveConfig";

const __config__ = resolveConfig();

axios.defaults.timeout = 30000;
export const http = axios.create({
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
    config.headers.Cookie = config.headers.Cookie || __config__.Cookie || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    const cookies = response.headers["set-cookie"];
    // console.log('set-cookies', cookies)
    if (cookies && cookies.length) {
      __config__.Cookie = cookies.map((v) => v.split(";")[0]).join(";");
    }
    // let res = response.data;
    // console.log(res);
    return response;
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
export const login = async () => {
  // 登录
  console.log("登录中");
  const res = await http.post(
    `${__config__.domain}/api/login`,
    qs.stringify({
      username: __config__.username,
      password: __config__.password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  // console.log('login ',res)
  console.log("登录成功");

  return res;
};
/**
 * 获取项目组
 */
export const getProgroups = async () => {
  const res = await http.get(`${__config__.domain}/api/progroups`);
  return res.data.result;
};

/**
 * 获取项目列表
 */
export const getProjects = async (pgid: string | number) => {
  const res = await http.get(`${__config__.domain}/api/progroups/${pgid}`);
  return res.data.result.projects;
};

/**
 * 获取接口列表
 */
export const getInterfaces = async (pid: string | number) => {
  const res = await http.get(`${__config__.domain}/api/interfaces/?pid=${pid}`);
  return res.data.result;
};

/**
 * 获取接口
 */
export const getInterface = async (id: string | number) => {
  const res = await http.get(`${__config__.domain}/api/interfaces/${id}`);
  return res.data.result;
};

/**
 * 获取类型
 */
export const getDataTypes = async (pid: string | number) => {
  const res = await http.get(`${__config__.domain}/api/datatypes/?pid=${pid}`);
  return res.data.result;
};

/**
 * 获取常量
 */
export const getConstraints = async (pid: string | number) => {
  const res = await http.get(
    `${__config__.domain}/api/constraints/?pid=${pid}`
  );
  return res.data.result;
};

/**
 * 获取整个project数据
 */
export const getProjectres = async (toolKey: string | number) => {
  const res = await http.get(
    `${__config__.domain}/api/projectres/?key=${toolKey}`
  );
  return res.data.result;
};

/**
 * 获取常量
 */
export const logout = async () => {
  const res = await http.get(`${__config__.domain}/logout`);
  return res.data.result;
};