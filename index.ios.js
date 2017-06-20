/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  Navigator,
  NetInfo,
} from 'react-native';

import Login from './app/component/Login/index';
import HomePage from './app/component/HomePage/index';

//获取设备宽高
const {height, width} = Dimensions.get('window');

export default class labApp extends Component {
  constructor(props){
    super(props);
    this.state = {
        identify:false
    };
    this.defaultRoute = {component: Login};
    this.renderScene = function(route, navigator){
        let Component = route.component;
        return (
            <Component {...route.params} setIdentyfy={(navigator)=>this._setIdentify(navigator)} navigator={navigator} />
        );
    }
    //主页的navigator路由配置
    this.HomePageScenes = {
      component: HomePage,
      params: {
        exit:(navigator)=>this._exit(navigator)
      }
    };
  }
  //判断用户是否保存登录状态进行登录
  componentWillMount(){
    NetInfo.fetch().done((status)=> {
           console.log('Status:'+status);
       });
       console.log(NetInfo.isConnected);
  }
  //登录成功后跳转到主页
  _setIdentify(navigator){
    this.setState({
      identify:true
    });
    navigator.push(this.HomePageScenes);
  }
  _exit(navigator){
    AsyncStorage.removeItem('@userToken');
    AsyncStorage.removeItem('@userTokenTemp');
    this.setState({
      identify:false,
    });
    navigator.popN(2);
  }
  render() {
    return (
      <Navigator
                initialRoute={this.defaultRoute}
                configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJump }
                renderScene={this.renderScene.bind(this)}
                configureScene={(route) => {
                  var conf = Navigator.SceneConfigs.HorizontalSwipeJump;
                  conf.gestures = null;
                  return conf;
                }}
            />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width:width,
    height:height
  },
});
AppRegistry.registerComponent('labApp', () => labApp);
