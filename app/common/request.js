'use strict'
import {
  AsyncStorage,
} from 'react-native';
import appConfig from '../app.config';
var queryString = require('query-string');
var _ = require('lodash');
var userRequest = {};
var userApi = {
  login:'index.php?r=api/user/login',//用户登录
  userInfo:'index.php?r=api/user/userinfo',//获取用户信息
  msgNum:'index.php?r=api/message/getcnt',//获取用户消息条数
  msgList:'index.php?r=api/message',//获取用户消息列表
  equipmentList:'index.php?r=api/equipment/list',//获取设备列表
  roomList:'index.php?r=api/makean/lab',//获取实验室列表
  equipmentOfRoom:'index.php?r=api/makean/equipment-by-lab-id',//获取实验室拥有的设备
  teacherList:'index.php?r=api/user/teachers',//获取指导老师列表
  approveListOfEquipment:'index.php?r=api/equipment/checklist',//获取设备审批列表
  approveListOfEquipmentInfo:'index.php?r=api/equipment/checklistinfo',//获取设备审批列表详情
  checkEquipment:'index.php?r=api/equipment/check',//设备借出信息审核操作
  checkRoom:'index.php?r=api/makean/check-status',//实验室借出信息审核操作
  approveListOfRoom:'index.php?r=api/makean/list',//获取实验室审批列表
  approveListOfRoomInfo:'index.php?r=api/makean/look',//获取实验室审批详情
  applyRoom:'index.php?r=api/makean/applyfor',//申请实验室
  applyEquipment:'index.php?r=api/equipment/create',//申请设备
  getCourse:'index.php?r=api/makean/date',//获取实验室可用课时
  reSetPassword:'index.php?r=api/user/resetpasswd',//修改密码
  MyApplyEquipments:'index.php?r=api/equipment/mylist',//我发起的设备申请列表
  MyApplyEquipmentsInfo:'index.php?r=api/equipment/mylistinfo',//我发起的设备申请详情
};

userRequest.get = function(url,params){
  return AsyncStorage.getItem('@userTokenTemp').then((tp_token)=>{
    var potions = _.extend({
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorizations':tp_token,
      },
    });
    url = appConfig.mainIP + url;
    if (params){
        //  url += '&' + queryString.stringify(params);
         url += '&params=';
         url += JSON.stringify(params);
       }
    return fetch(url,potions)
    .then((response) => {
      return response.json()
    })
    .then((response)=>{

      if(response._resettoken){

        AsyncStorage.setItem('@userTokenTemp',response._resettoken);
        AsyncStorage.getItem('@userToken').then((data)=>{
          if(data){
            AsyncStorage.setItem('@userTokenTemp',response._resettoken).then(()=>{
            });
          }
        });

      }
        return response
    })

  });

};

userRequest.post = function(url,body){
  return AsyncStorage.getItem('@userTokenTemp').then((tp_token)=>{
    var potions = _.extend({
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorizations':tp_token,
      }
    },
    {
      body: JSON.stringify(body)
    });
    url = appConfig.mainIP + url;
    return fetch(url,potions)
    .then((response) => {
      return response.json()
    }).then((response)=>{

      if(response._resettoken){

        AsyncStorage.setItem('@userTokenTemp',response._resettoken);
        AsyncStorage.getItem('@userToken').then((data)=>{
          if(data){
            AsyncStorage.setItem('@userTokenTemp',response._resettoken).then(()=>{
            });
          }
        });
      }
      return response
    })
  })


};


export default userRequest;
export {userApi};
