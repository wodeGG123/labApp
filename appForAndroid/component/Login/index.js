'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Picker,
  Dimensions,
  TouchableHighlight,
  Modal,
  AsyncStorage,
  Alert,
} from 'react-native';
import userRequest,{userApi} from '../../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
const {height, width} = Dimensions.get('window');
const PickerItem = Picker.Item;

//登录组件
export default class Login extends Component {
  constructor(props){
    super(props);
    this.state={
        checkName:'ios-checkbox',
        rememberMe:true,
        userName:'',
        password:'',
        type:1,
        type_text:{
          1:'学生',
          2:'老师',
          4:'实验室管理员',
        },
    };
  }
  _handleRememberMe(){
    let _bool = !this.state.rememberMe;
    this.setState({
      checkName:_bool?'ios-checkbox':'ios-checkbox-outline',
      rememberMe:_bool
    })
  }
  _setUserName(val){
    this.setState({
      userName:val,
    })
  }
  _setPassword(val){
    this.setState({
      password:val,
    })
  }
  _handleSubmit(){

    //登录请求
    userRequest.post(userApi.login,{
      sid:this.state.userName,
      password:this.state.password,
      type:this.state.type,
    })
    .then((data)=>{

      //判断用户登录是否成功
      if(data.code == '0003'){
        Alert.alert('提示',data.data.error);
        return false;
      }
      else{


        //是否保存用户token
        if(this.state.rememberMe){
            AsyncStorage.setItem('@userToken',data.data.Token).then(()=>{
            });
        }else{
          AsyncStorage.removeItem('@userToken',()=>{
          });
        }
        //设置用户token
        AsyncStorage.setItem('@userTokenTemp',data.data.Token).then(()=>{
          //登录成功页面跳转
          this.props.setIdentyfy(this.props.navigator);
        });


      }

    });
    // AsyncStorage.getItem('@userToken').then((data)=>console.log(data))


    // AsyncStorage.setItem('@userToken',ppp,()=>alert(AsyncStorage.getItem('@userToken')));
  }
  componentWillMount(){

      AsyncStorage.removeItem('@userTokenTemp').then(()=>{

        AsyncStorage.getItem('@userToken').then((data)=>{
          if(data){
            AsyncStorage.setItem('@userTokenTemp',data).then(()=>{

              userRequest.get(userApi.userInfo,{})
              .then((data)=>{
                if(data.code == '0000'){
                    this.props.setIdentyfy(this.props.navigator);
                }

              });


            });
          }
        });

      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.login_back}
          source={require('./img/Login-back.jpg')}
          resizeMode='cover'
        />

        <View>

          <Image
            style={styles.login_logo}
            source={require('./img/Login-logo.png')}
            resizeMode='contain'
          />
          <Text style={styles.login_title}>实验室教学信息化管理平台</Text>
          <View style={styles.login_item_block}>
            <Icon name='md-person' style={styles.login_icon} />
            <TextInput ref='userName' underlineColorAndroid={'transparent'} onChangeText={(val)=>this._setUserName(val)} style={styles.login_input} placeholder="user" value={this.state.userName} />
          </View>
          <View style={styles.login_item_block}>
            <Icon name='md-lock' style={styles.login_icon} />
            <TextInput ref='password' underlineColorAndroid={'transparent'} secureTextEntry={true}  password={true} onChangeText={(val)=>this._setPassword(val)} style={styles.login_input} placeholder="password" value={this.state.password} />
          </View>
          <View style={styles.login_item_block}>
          <View style={{height:40,display:'flex',justifyContent:'center',alignItems:'center',position:'relative',}}>
            <Text style={styles.selectText}>{this.state.type_text[this.state.type]}</Text>
            <Picker
              style={styles.pickerWrap}
              prompt='请选择角色'
              selectedValue={this.state.type}
              onValueChange={(value) => this.setState({type:value})}>
              <Picker.Item label="学生" value="1" />
              <Picker.Item label="老师" value="2" />
              <Picker.Item label="实验室管理员" value="4" />
            </Picker>
          </View>

          </View>
          <TouchableHighlight onPress={()=>this._handleRememberMe()} activeOpacity={0.6} underlayColor={'transparent'}>
            <View style={styles.checkWrap}>
                  <Icon name={this.state.checkName} style={styles.checkStyle} />
                  <Text style={styles.rememberMe}>记住我</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{marginTop:75}} onPress={()=>this._handleSubmit()} activeOpacity={0.6} underlayColor={'transparent'}>
                  <View style={styles.submit}>
                    <Text style={styles.submitText}>登录</Text>
                  </View>
          </TouchableHighlight>


        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display:'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position:'relative',
    width:width,
    height:height
  },
  login_back:{
    position:'absolute',
    left:0,
    top:0,
    width:'100%',
    height:'100%',
  },
  login_logo:{
    maxWidth:180,
    maxHeight:60,
    marginLeft:'auto',
    marginRight:'auto',

  },
  login_item_block:{
    width:300,
    height:40,
    backgroundColor:'white',
    borderRadius:20,
    position:'relative',
    marginBottom:15,
  },
  login_title:{
    fontSize:21,
    color:'#06aaff',
    backgroundColor:'transparent',
    marginTop:15,
    marginBottom:40,
    textAlign:'center',
  },
  login_icon:{
    fontSize:24,
    color:'#666',
    backgroundColor:'transparent',
    position:'absolute',
    left:20,
    top:7,
  },
  login_input:{
    backgroundColor:'transparent',
    fontSize:16,
    width:230,
    height:40,
    lineHeight:40,
    position:'absolute',
    right:20,
    color:'#666',
  },
  login_identify:{
    fontSize:18,
    color:'#666',
    backgroundColor:'transparent',
    textAlign:'center',
    lineHeight:40
  },
  checkWrap:{
    display:'flex',
    flexDirection:'row',
  },
  checkStyle:{
    fontSize:20,
    color:'#00c6ff'
  },
  rememberMe:{
    fontSize:16,
    color:'#fff',
    lineHeight:18,
    marginLeft:6,
  },
  submit:{
    width:300,
    height:40,
    backgroundColor:'#7b7dea',
    borderRadius:20,
    position:'relative',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  submitText:{
    color:'#fff',
    fontSize:18,
    textAlign:'center',
    borderRadius:20,
    backgroundColor:'transparent'

  },
  selectText:{
    position:'relative',
    fontSize:16,
    color:'#333',
  },
  pickerWrap:{
    left:0,
    top:0,
    position:'absolute',
    width:300,
    backgroundColor:'transparent',
    color:'transparent',
  }
});
