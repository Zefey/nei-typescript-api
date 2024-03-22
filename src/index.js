#!/usr/bin/env node
const inquirer = require('inquirer')
const { login,getProgroups,getProjects,logout } = require("./request");
const { resolveConfig } = require("./resolveConfig");
const { generate } = require("./generate");

const __config__ = resolveConfig();

(async function() {
  // 配置了toolKey 走匿名接口
  if(!!__config__.toolKey){
  // 生成ts-api
    generate(__config__.toolKey)
    return
  }
  
  // 登录
  await login();

  let currentGroups = null
  let currentProject = null

  if(!__config__.pgid){
    // 获取项目组
    const res = await getProgroups();
    const answer = await inquirer.prompt([{
      type: 'list',
      message: '请选择项目组: ',
      choices: res.map(v => v.name),
      name: 'projectGroup',
      default: '',
    }])
    currentGroups = res.find(v => v.name === answer.projectGroup)
    __config__.pgid = currentGroups.id
  }

  // 获取项目列表
  const res = await getProjects(__config__.pgid);
  if(__config__.pid){
    currentProject = res.find(v => v.id === Number(__config__.pid))
  }else {
    const answer = await inquirer.prompt([{
      type: 'list',
      message: '请选择项目组: ',
      choices: res.map(v => v.name),
      name: 'project',
      default: '',
    }])
    currentProject = res.find(v => v.name === answer.project)
    __config__.pid = currentProject.id
  }

  // 生成ts-api
  generate(currentProject.toolKey)

  // 退出登录
  await logout()
})()

