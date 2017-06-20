
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  Navigator,
  ScrollView,
  TouchableHighlight,
  Modal,
  TextInput,
  AlertIOS,
} from 'react-native';

import {CommonHeader,CommonContentBlock,CommonSelect,CommonTabs,ToolButtoms} from '../Common/index';
import Icon from 'react-native-vector-icons/Ionicons';
import userRequest,{userApi} from '../../common/request';


const {height, width} = Dimensions.get('window');
export default class UserInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
        modalDate:false,
        oldPassword:'',
        newPassword:'',
        newPasswordRe:'',
    };

  }
  _showModal(modal){
    this.setState({
      modalDate:modal,
      oldPassword:'',
      newPassword:'',
      newPasswordRe:'',
    })
  }
  _changePassword(action,modal){
    if(action){
      userRequest.post(userApi.reSetPassword,{
        "oldPassword":this.state.oldPassword,
        "newPassword":this.state.newPassword,
        "retypePassword":this.state.newPasswordRe,
      }).then((data)=>{
        if(data.code == '0000'){

          AlertIOS.alert(
             '修改成功!',
            null,
            ()=>{  this.setState({
                modalDate:false,
              })}
          )

        }

    });
  }else{
    this.setState({
      modalDate:modal
    });
  }

  }
  render() {
    return (
      <View style={styles.container}>
        <CommonHeader title='个人信息' navigator={this.props.navigator}/>
        <ScrollView>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            账号
            </Text>
            <Text style={styles.textRight}>
            {this.props.info.sid}
            </Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            姓名
            </Text>
            <Text style={styles.textRight}>
            {this.props.info.username}
            </Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            电子邮箱
            </Text>
            <Text style={styles.textRight}>
          {this.props.info.email}
            </Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            班级
            </Text>
            <Text style={styles.textRight}>
            {this.props.info.class}
            </Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            最后登录IP
            </Text>
            <Text style={styles.textRight}>
            {this.props.info.end_login_ip}
            </Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            最后登录时间
            </Text>
            <Text style={styles.textRight}>
            {this.props.info.end_login_at}
            </Text>
          </View>
          {/*
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            创建时间
            </Text>
            <Text style={styles.textRight}>
            奔跑的蚂蚁
            </Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            更新时间
            </Text>
            <Text style={styles.textRight}>
            奔跑的蚂蚁
            </Text>
          </View>
          */}
          <TouchableHighlight activeOpacity={1} underlayColor={'transparent'} onPress={()=>{this._showModal(true)}}>

          <View style={styles.block}>
            <Icon name="ios-arrow-forward" style={styles.itemRightBt}/>
            <Text style={styles.textLeft}>修改密码</Text>
          </View>
          </TouchableHighlight>
          <TouchableHighlight activeOpacity={1} style={{marginTop:30,}} underlayColor={'transparent'} onPress={()=>{this.props.exitBt()}}>
            <View style={styles.exitBtBlock}>
              <Text style={styles.exitBt}>退出登录</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalDate}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <CommonHeader title='修改密码' backIcon={false} navigator={this.props.navigator}/>
          <ScrollView>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            旧密码
            </Text>
            <View style={styles.itemRightBox}>
            <TextInput
              style={styles.itemRightText}
              onChangeText={(text) => this.setState({oldPassword:text})}
              value={this.state.oldPassword}
              placeholder='请输入旧密码'
              secureTextEntry={true}
            />
            </View>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            新密码
            </Text>
            <View style={styles.itemRightBox}>
            <TextInput
              style={styles.itemRightText}
              onChangeText={(text) => this.setState({newPassword:text})}
              value={this.state.newPassword}
              placeholder='请输入新密码'
              secureTextEntry={true}
            />
            </View>
          </View>
          <View style={styles.block}>
            <Text style={styles.textLeft}>
            重新输入新密码
            </Text>
            <View style={styles.itemRightBox}>
            <TextInput
              style={styles.itemRightText}
              onChangeText={(text) => this.setState({newPasswordRe:text})}
              value={this.state.newPasswordRe}
              placeholder='请重新输入新密码'
              secureTextEntry={true}
            />
            </View>
          </View>
          </ScrollView>
          <ToolButtoms allowText={'确认'} refuseText={'取消'} allowAction={()=>this._changePassword(true,false)} refuseAction={()=>this._changePassword(false,false)} />

        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:width,
    height:height
  },
  block:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',

    borderBottomWidth:1,
    borderColor:'#e9eaed',
    paddingLeft:15,
    paddingRight:15,
    position:'relative',
  },
  textLeft:{
    flex:1,
    backgroundColor:'transparent',
    fontSize:16,
    color:'#242424',
    lineHeight:45,
    height:45,
  },
  textRight:{
    flex:1,
    backgroundColor:'transparent',
    fontSize:16,
    color:'#666',
    lineHeight:45,

    textAlign:'right',
  },
  itemRightBt:{
    position:'absolute',
    right:15,
    top:10,
    fontSize:24,
    color:'#242424',
    zIndex:1,
  },
  itemRightText:{
    backgroundColor:'transparent',
    fontSize:16,
    color:'#666',
    lineHeight:45,
    height:45,
    textAlign:'right',
    borderWidth:0,
  },
  itemRightBox:{
    flex:1,
    backgroundColor:'transparent',
    height:45,
  },
  exitBtBlock:{
    height:40,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#7b7dea',
    borderRadius:5,
  },
  exitBt:{
    fontSize:16,
    lineHeight:40,
    color:'#fff',
    backgroundColor:'transparent',
    textAlign:'center',

  },
});
