import path from "path";
import inquirer from "inquirer";
import ejs from "ejs";
import fs from "fs-extra";
import { toLowerCamelCase, toUpperCamelCase } from "./utils";
import { getProjectres } from "./request";
import { resolveConfig } from "./resolveConfig";

const __config__ = resolveConfig();

const formatType = (list: any, type: any) => {
  // 基础类型
  const typeMapping: any = {
    File: "string",
    Variable: "string",
    String: "string",
    Number: "number",
    Boolean: "boolean",
    Guid: "string",
    Int: "number",
    long: "number",
    int: "number"
  };
  return list.map((v: any) => {
    let res = {};
    if (typeMapping[v.typeName]) {
      res = {
        ...v,
        typeName: typeMapping[v.typeName],
      };
    } else {
      const find = type.find((t: any) => t.id === v.type);
      if (find) {
        const isEnum = (find.name ?? '').toLowerCase().includes("enum");
        let tempType = ''
        if(isEnum){
          tempType = find.params
            .map((vv: any) => `\'${vv.name || vv.defaultValue}\'`)
            .join(" | ");
          }else {
            tempType = formatType(find.params, type)
          }
        res = {
          ...v,
          typeName:tempType,
        };
      }
    }
    return res;
  });
};

// 递归
const fn = (list: any) => {
  const enter = list.length>0 ? '\n':''
  const res = list.map(
    (v: any) =>
      `\t${v.name}${v.required === 0 ? '?':''}:${
        Array.isArray(v.typeName) ? `{${fn(v.typeName)}}[]` : v.typeName
      }; ${v.description ? `// ${v.description} ` : ''}`
  ).join("\n")
  return `${enter}${res}${enter}`
};

const generateFile = (interfaces: any) => {
  const pathArr = interfaces[0].path.split("/")
  const filename = toLowerCamelCase(`${pathArr[pathArr.length-2]}.ts`);

  const list = interfaces.map((v: any) => {
    const pathArr = v.path.split("/");
    const name = pathArr[pathArr.length - 1];
    return {
      comment: v.name,
      nameLower: toLowerCamelCase(name),
      nameUpper: toUpperCamelCase(name),
      type: v.method.toLowerCase(),
      url: v.path,
    };
  });
  const ejsFolder = __config__.ejs || path.join(__dirname, "..", "template")
  const ejsUrl = path.join(ejsFolder, "template.ejs");
  const templateStr = fs.readFileSync(ejsUrl, {
    encoding: "utf-8",
  });
  const file = ejs.render(templateStr, { list });
  const dir = __config__.distDir;
  const url = `${dir}/${filename}`;
  try {
    fs.accessSync(dir, fs.constants.F_OK);
  } catch (error) {
    fs.mkdirSync(dir, { recursive: true });
  } finally {
    fs.writeFileSync(url, file);
    console.log(`写入成功`);
  }
};

const generateType = async (interfaces: any, type: any, distType: any) => {
  const pathArr = interfaces[0].path.split("/")
  const suffix = distType === "inner" ? "" : ".d"
  const filename = toLowerCamelCase(`${pathArr[pathArr.length-2]}${suffix}.ts`);

  const list = interfaces.map((v: any) => {
    const pathArr = v.path.split("/");
    const name = pathArr[pathArr.length - 1];
    return {
      comment: v.name,
      nameLower: toLowerCamelCase(name),
      nameUpper: toUpperCamelCase(name),
      type: v.method.toLowerCase(),
      url: v.path,
      inputs: formatType(v.params.inputs, type) || [],
      outputs: formatType(v.params.outputs, type) || [],
    };
  });

  const ejsFolder = __config__.ejs || path.join(__dirname, "..", "template")
  const ejsUrl = path.join(
    ejsFolder,
    distType === "inner" ? "templateAll.ejs" : "templateType.ejs"
  );
  const templateStr = fs.readFileSync(ejsUrl, { encoding: "utf-8" });
  const file = ejs.render(templateStr, { list, fn });
  const dir = __config__.distDir;
  const url = `${dir}/${filename}`;
  try {
    fs.accessSync(dir, fs.constants.F_OK);
  } catch (error) {
    fs.mkdirSync(dir, { recursive: true });
  } finally {
    fs.writeFileSync(url, file);
    console.log(`写入成功`);
  }
};

export const generate = async (toolKey: string) => {
  const { groups, interfaces, datatypes } = await getProjectres(toolKey);
  if (!__config__.gid) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        message: "请选择分组: ",
        choices: groups.map((v: any) => v.name),
        name: "group",
        default: "",
      },
    ]);
    const currentGroup = groups.find((v: any) => v.name === answer.group);
    __config__.gid = currentGroup.id;
  }
  // 根据gid生成
  const interfaceList = interfaces.filter(
    (v: any) => v.group.id === Number(__config__.gid)
  );
  // const typeList = datatypes.filter(v => v.group.id === Number(__config__.gid))
  if (__config__.distType === "outer") {
    generateFile(interfaceList);
  }
  generateType(interfaceList, datatypes, __config__.distType);
};
