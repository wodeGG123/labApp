'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  AsyncStorage,
  TouchableHighlight,
  AlertIOS,
} from 'react-native';
//引用公共组件
import userRequest,{userApi} from '../../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
//分支页面
import MSG from '../MSG/index';
import ApplyLab from '../ApplyLab/index';
import ApplyEquipment from '../ApplyEquipment/index';
import MyApproval from '../MyApproval/index';
import MyApply from '../MyApply/index';
import UserInfo from '../UserInfo/index';
import CameraTest from '../CameraTest/index';

//获取设备宽高
const {height, width} = Dimensions.get('window');

export default class HomePage extends Component {

    constructor(props){
      super(props);
      this.state = {
          msgNum:false,
          userName:'',
          plantName:'',
          userImg:require('./img/timg.jpg'),
          userInfo:{},
      };

      //设置navigator的scenes
      this.MSGScenes = {
        component: MSG,
        params: {}
      };
      this.ApplyLab = {
        component: ApplyLab,
        params: {}
      };
      this.ApplyEquipment = {
        component: ApplyEquipment,
        params: {}
      };
      this.MyApply = {
        component: MyApply,
        params: {}
      };
      this.MyApproval = {
        component: MyApproval,
        params: {}
      };
      this.UserInfo = {
        component: UserInfo,
        params: {}
      };
      this.CameraTest = {
        component: CameraTest,
        params: {}
      };
    }
    componentDidUpdate(){
    }
    componentWillMount(){
        userRequest.get(userApi.userInfo,{})
        .then((data)=>{
          this.setState({
            userName:data.data.username,
            plantName:data.data.system_name,
            userInfo:data.data,
          });
        });
        userRequest.get(userApi.msgNum,{})
        .then((data)=>{
          this.setState({
            msgNum:data.data.cnt,
          });
        });
    }
    _showMSG(){
      this.props.navigator.push(this.MSGScenes);
    }
    _showApplyLab(){
      if(this.state.userInfo.type==4){
        AlertIOS.alert(
           '您的身份不能进行此操作！',
          );
      }else{
        this.ApplyLab = {
          component: ApplyLab,
          params: {
            userInfo:this.state.userInfo
          }
        };
          this.props.navigator.push(this.ApplyLab);
      }
    }
    _showApplyEquipment(){
      if(this.state.userInfo.type==4){
        AlertIOS.alert(
           '您的身份不能进行此操作！',
          );
      }else{

        this.ApplyEquipment = {
          component: ApplyEquipment,
          params: {
            userInfo:this.state.userInfo
          }
        };
        this.props.navigator.push(this.ApplyEquipment);
      }
    }
    _showMyApproval(){
      if(this.state.userInfo.type==1){
        AlertIOS.alert(
           '您的身份不能进行此操作！',
          );
      }else{
        this.MyApproval = {
          component: MyApproval,
          params: {
            userInfo:this.state.userInfo
          }
        };
        this.props.navigator.push(this.MyApproval);
      }

    }
    _showUserInfo(){

      this.UserInfo = {
        component: UserInfo,
        params: {
          info:this.state.userInfo,
          exitBt:()=>{this.props.exit(this.props.navigator)}
        }
      };
      this.props.navigator.push(this.UserInfo);
    }

    _showMyApply(url,title,type){
      if(this.state.userInfo.type==4){
        AlertIOS.alert(
           '您的身份不能进行此操作！',
          );
      }else{
        this.MyApply = {
          component: MyApply,
          params: {
            type:type,
            sourceUrl:url,
            pageTitle:title,
            userId:this.state.userInfo.id,
          }
        };
        this.props.navigator.push(this.MyApply);
      }
    }
    _showCamera(){

      if(this.state.userInfo.type!=4){
        AlertIOS.alert(
           '您的身份不能进行此操作！',
          );
      }else{
        this.CameraTest = {
          component: CameraTest,
          params: {
              userInfo:this.state.userInfo,
          }
        };
        this.props.navigator.push(this.CameraTest);
      }

    }
    render(){

      return (
          <View style={styles.container}>
            <View style={styles.topBlock}>
                  <Image
                  style={styles.topBack}
                  source={require('./img/top-back.png')}
                  resizeMode='cover'
                   />
                  <View style={styles.topMain}>
                     <Image
                        style={styles.userImg}
                        source={this.state.userImg}
                        resizeMode='contain'
                     />
                     <Text style={styles.userName}>{this.state.userName},您好</Text>
                     <Text style={styles.plantName}>欢迎登录{this.state.plantName}</Text>
                  </View>
                    <TouchableHighlight style={styles.msgBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._showMSG()}}>
                    <View style={{backgroundColor:'transparent'}}>
                    <Image source={require('./img/chat-icon.png')} resizeMode='contain' style={styles.chat_icon} />
                    {this.state.msgNum&&
                      <View style={styles.msgNumBlock}><Text style={styles.msgNum}>{this.state.msgNum}</Text></View>
                    }
                    </View>
                    </TouchableHighlight>
                  <TouchableHighlight style={{
                    position:'absolute',
                    right:15,
                    top:30,
                  }} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._showCamera()}}>
                  <Image
                     style={styles.qrCode}
                     source={require('./img/qr-scaner.png')}
                     resizeMode='contain'
                  />
                  </TouchableHighlight>
            </View>
            <View style={styles.bottomBlock}>
            <TouchableHighlight style={styles.touchBox} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> {this._showApplyLab()}}>
                <View style={styles.item}>
                  <Image
                     style={styles.itemImg}
                     source={require('./img/logo1.png')}
                     resizeMode='contain'
                  />
                  <Text style={styles.itemText}>申请实验室</Text>
                </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchBox} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> {this._showApplyEquipment()}}>
                <View style={styles.item}>
                  <Image
                     style={styles.itemImg}
                     source={require('./img/logo2.png')}
                     resizeMode='contain'
                  />
                  <Text style={styles.itemText}>申请设备</Text>
                </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchBox} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> {this._showMyApply(userApi.approveListOfRoom,'实验室申请列表',0)}}>
                <View style={styles.item}>
                  <Image
                     style={styles.itemImg}
                     source={require('./img/logo6.png')}
                     resizeMode='contain'
                  />
                  <Text style={styles.itemText}>实验室申请列表</Text>
                </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchBox} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> {this._showMyApply(userApi.MyApplyEquipments,'设备申请列表',1)}}>
                <View style={styles.item}>
                  <Image
                     style={styles.itemImg}
                     source={require('./img/logo7.png')}
                     resizeMode='contain'
                  />
                  <Text style={styles.itemText}>设备申请列表</Text>
                </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchBox} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> {this._showMyApproval()}}>
                <View style={styles.item}>
                  <Image
                     style={styles.itemImg}
                     source={require('./img/logo4.png')}
                     resizeMode='contain'
                  />
                  <Text style={styles.itemText}>我的审批</Text>
                </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchBox} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> {this._showUserInfo()}}>
                <View style={styles.item}>
                  <Image
                     style={styles.itemImg}
                     source={require('./img/logo3.png')}
                     resizeMode='contain'
                  />
                  <Text style={styles.itemText}>个人信息</Text>
                </View>
                </TouchableHighlight>
            </View>
          </View>

      )
    }

}
const styles = StyleSheet.create({
  container:{
    width:width,
    height:height,
  },
  topBlock:{
    height:'32%',
    width:'100%',
    position:'relative',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  topBack:{
    width:'100%',
    height:'100%',
    position:'absolute',
    left:0,
    top:0,
  },
  topMain:{

  },
  userImg:{
    width:80,
    height:80,
    borderRadius:40,
    marginLeft:'auto',
    marginRight:'auto',
    marginTop:40,
    // borderWidth:10,
    // borderColor:'rgba(44,27,141,0.6)'
  },
  userName:{
    fontSize:16,
    color:'#00c6ff',
    backgroundColor:'transparent',
    textAlign:'center',
    marginTop:10,
    marginBottom:6,
  },
  plantName:{
    fontSize:12,
    color:'#fff',
    backgroundColor:'transparent',
    textAlign:'center',
  },
  bottomBlock:{
    width:'100%',
    height:'68%',
    backgroundColor:'#eff3f6',
    display:'flex',
    flexDirection:'row',
    borderWidth:15,
    borderColor:'#eff3f6',
    justifyContent:'space-between',
    flexWrap:'wrap',
  },
  touchBox:{
    height:110,
    marginBottom:15,
    width:'48%',
  },
  item:{
    width:'100%',
    height:110,
    backgroundColor:'#fff',
    position:'relative',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',

    borderWidth:1,
    borderColor:'#e9eaed',
  },
  itemImg:{
    width:45,
    height:45,
  },
  itemText:{
    fontSize:15,
    color:'#242424',
    marginTop:4
  },
  msgBlock:{
    position:'absolute',
    left:15,
    top:20,
    backgroundColor:'transparent',
  },
  chat_icon:{
    width:26
  },
  msgNumBlock:{
    height:13,
    width:13,
    borderRadius:13,
    backgroundColor:'#fff',
    position:'absolute',
    top:8,
    right:-4,
  },
  msgNum:{
    fontSize:12,
    height:13,
    width:13,
    borderRadius:13,
    backgroundColor:'transparent',
    color:'#4618b3',
    lineHeight:13,
    textAlign:'center',

  },
  exitBlock:{
    position:'absolute',
    right:15,
    top:35,
  },
  exitText:{
    fontSize:16,
    color:'#fff',
  },
  qrCode:{
    width:25,
    height:25,
  },
})
