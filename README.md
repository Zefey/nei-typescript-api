为了前端方便使用 nei 上的接口，自动生成 api 方法以及对应的ts类型

## 使用

`npm install -D nei-typescript-api`

或

`yarn add -D nei-typescript-api`


在package.json 的 script 添加"api": "nei-typescript-api"

`npm run api`

也可以直接执行 nei-typescript-api

## 配置文件

在根目录下创建 neiApi.config.js

```
module.exports = {
  username: "",
  password: "",
  pgid: "", // 项目组id
  pid: "", // 项目id
  gid: "",  // 分组id
  toolKey: "1cae162bdb3fb8fc14ead9f8e21c2b18", // 项目key
  distDir: "./services", // 输出路径
  domain: "http://nei.youcaihua.net:8082", // 接口文档地址
  distType: "outer", // // inner: 类型和接口放相同文件；outer: 类型和接口分不同文件
  ejs: "", // ejs模板文件夹路径
};
```

username 和 password可单独建 `.neiApi.json` 并配置 `.gitignore`

```
{
  "username":"",
  "password":""
}
```

## 输出样例

默认输出格式

```
import { request } from '@ykb/core'

// 获取外挂APP重定向地址
export async function getAppletRedirect(data:API.GetAppletRedirectParams) {
  const result = await request.get<API.GetAppletRedirectResponses>(data, {
    url: '/ykb_outapp/api/v1/OutApplet/GetAppletRedirect',
  })

  return result
}

```

```
declare namespace API {
  // 获取外挂APP重定向地址
  interface GetAppletRedirectParams {
    OutAppType:string;
  }

  interface GetAppletRedirectResponses {
    
  }
  
}

```

### 可在 `neiApi.config.js` 文件配置 `ejs` 路径

例如

```
module.exports = {
  ...
  ejs: path.resolve(__dirname, 'template'), // ejs模板路径
  ...
};
```

文件夹 `template` 根据 `distType` 自定义输出的 ejs 格式文件

### 当 distType 为inner 时

参考并配置 `templateAll.ejs`

```
import { request } from '@ykb/core'

<% list.forEach(function(item, index) { %>
// <%= item.comment %>
export async function <%= item.nameLower %>(data:{
  <%- fn(item.inputs) %>
}) {
  const result = await request.<%= item.type %><{
    <%- fn(item.outputs) %>
  }>(data, {
    url: '<%= item.url %>',
  })

  return result
}
<% }) %>
```

### 当 distType 为inner 时

参考并配置 `template.ejs`

```
import { request } from '@ykb/core'
<% list.forEach(function(item, index) { %>
// <%= item.comment %>
export async function <%= item.nameLower %>(data:API.<%= item.nameUpper %>Params) {
  const result = await request.<%= item.type %><API.<%= item.nameUpper %>Responses>(data, {
    url: '<%= item.url %>',
  })

  return result
}
<% }) %>
```

参考并配置 `templateType.ejs`

```
declare namespace API {

<% list.forEach(function(item) { %>

  // <%= item.comment %>
  interface <%= item.nameUpper %>Params {
    <%- fn(item.inputs) %>
  }

  interface <%= item.nameUpper %>Responses {
    <%- fn(item.outputs) %>
  }
  
  <% }) %>
}

```

