'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  PickerIOS,
  Dimensions,
  TouchableHighlight,
  Modal,
  AsyncStorage,
  AlertIOS,
} from 'react-native';
import userRequest,{userApi} from '../../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
const {height, width} = Dimensions.get('window');
const PickerItemIOS = PickerIOS.Item;

//登录组件
export default class Login extends Component {
  constructor(props){
    super(props);
    this.state={
        selecting:false,
        selectObj:{val:1,text:'学生',key:0,},
        checkName:'ios-checkbox',
        rememberMe:true,
        userName:'',
        password:'',
        type:1,
    };
  }
  _handleSelecting(){
    this.setState({
      selecting:true
    })
  }
  _handleRememberMe(){
    let _bool = !this.state.rememberMe;
    this.setState({
      checkName:_bool?'ios-checkbox':'ios-checkbox-outline',
      rememberMe:_bool
    })
  }
  _handleSelected(selectObj){
    this.setState({
      selecting:false,
      selectObj:selectObj,
      type:selectObj.val,
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
        AlertIOS.alert(data.data.error,null);
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
            <TextInput ref='userName' onChangeText={(val)=>this._setUserName(val)} style={styles.login_input} placeholder="user" value={this.state.userName} />
          </View>
          <View style={styles.login_item_block}>
            <Icon name='md-lock' style={styles.login_icon} />
            <TextInput ref='password' password={true} onChangeText={(val)=>this._setPassword(val)} style={styles.login_input} placeholder="password" value={this.state.password} />
          </View>
          <View style={styles.login_item_block}>
              <TouchableHighlight style={{borderRadius:20}} activeOpacity={0.6} underlayColor={'#eee'} onPress={()=> this._handleSelecting()} ><Text style={styles.login_identify}>{this.state.selectObj.text}</Text></TouchableHighlight>
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
          {
            this.state.selecting && <CustomPicker completeSelect={(obj)=>this._handleSelected(obj)} pickerSelectObj={this.state.selectObj} pickerItems={[{val:'1',text:'学生'},{val:'2',text:'老师'},{val:'4',text:'实验室管理员'}]}/>
          }
      </View>
    );
  }
}

//picker组件
//组件属性配置说明：
//props.pickerItems 初始化选择项
//props.pickerSelectObj  初始化已选择项
class CustomPicker extends Component{

  constructor(props){
    super(props);
    this.state={
        pickerItems:(this.props.pickerItems||[{}]),
        modelIndex:0,
        pickerSelectObj:this.props.pickerSelectObj,
        modalVisible:true,
    };
  }
  componentWillMount(){

  }
  componentDidUpdate(){

      //执行回调函数，信息返回给父级组件
      this.props.completeSelect(
        {val:this.state.pickerItems[this.state.modelIndex].val,text:this.state.pickerItems[this.state.modelIndex].text,key:this.state.modelIndex}
      );


  }
  render() {

    return (
      <Modal
         animationType={"fade"}
         transparent={true}
         visible={this.state.modalVisible}
         onRequestClose={() => {}}
         >
         <View style={CustomPickerStyles.pickerWrap}>
           <PickerIOS
             style={CustomPickerStyles.pickerBack}
             selectedValue={this.state.pickerItems[this.state.modelIndex].val&&this.state.pickerSelectObj.val}
             onValueChange={(val,key) => {this.setState({modelIndex:key})}}>
               {
                 this.state.pickerItems.map((item,index)=> {return (<PickerItemIOS
                 key={index}
                 value={item.val}
                 label={item.text}
               />)
               })
             }
           </PickerIOS>
         </View>
       </Modal>


    )
  }

}
const CustomPickerStyles=StyleSheet.create({
  pickerWrap:{
      top:'50%',
      marginTop:-110,
      width:300,
      height:300,
      borderRadius:10,
      marginLeft:'auto',
      marginRight:'auto',
  },
  pickerBack:{
    backgroundColor:'white',
    borderRadius:10,
  }
});
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
  },
  submitText:{
    color:'#fff',
    lineHeight:40,
    fontSize:18,
    textAlign:'center',
    borderRadius:20,
    backgroundColor:'transparent'

  }
});
