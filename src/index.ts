#!/usr/bin/env node
import inquirer from "inquirer";
import { login, getProgroups, getProjects, logout } from "./request";
import { resolveConfig } from "./resolveConfig";
import { generate } from "./generate";

const __config__ = resolveConfig();

(async function () {
  // 配置了toolKey 走匿名接口
  if (!!__config__.toolKey) {
    // 生成ts-api
    generate(__config__.toolKey);
    return;
  }

  // 登录
  await login();

  let currentGroups: any = null;
  let currentProject: any = null;

  if (!__config__.pgid) {
    // 获取项目组
    const res = await getProgroups();
    const answer = await inquirer.prompt([
      {
        type: "list",
        message: "请选择项目组: ",
        choices: res.map((v: any) => v.name),
        name: "projectGroup",
        default: "",
      },
    ]);
    currentGroups = res.find((v: any) => v.name === answer.projectGroup);
    __config__.pgid = currentGroups.id;
  }

  // 获取项目列表
  const res = await getProjects(__config__.pgid);
  if (__config__.pid) {
    currentProject = res.find((v: any) => v.id === Number(__config__.pid));
  } else {
    const answer = await inquirer.prompt([
      {
        type: "list",
        message: "请选择项目组: ",
        choices: res.map((v: any) => v.name),
        name: "project",
        default: "",
      },
    ]);
    currentProject = res.find((v: any) => v.name === answer.project);
    __config__.pid = currentProject.id;
  }

  // 生成ts-api
  generate(currentProject.toolKey);

  // 退出登录
  await logout();
})();
