
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  Navigator,
  ListView,
  TouchableHighlight,
  Image,
  AlertIOS,
} from 'react-native';


//引用模块组件
import {CommonHeader,CommonContentBlock,CommonSelect,CommonTabs} from '../Common/index';

import userRequest,{userApi} from '../../common/request';
import MyApprovalInfo from '../MyApprovalInfo/index';
import _ from 'lodash';
import Camera from 'react-native-camera';
import BarcodeScanner from 'react-native-barcode-scanner-universal';


import Icon from 'react-native-vector-icons/Ionicons';
const {height, width} = Dimensions.get('window');
export default class CameraTest extends Component {

  constructor(props){
    super(props);
    this.state={

    }
    this.isReadEd=false;
    this.MyApprovalInfo={
      component: MyApprovalInfo,
      params: {
      }
    };
  }

　//解析数据
  parseData(pdata){
      if(!this.isReadEd){
        this.isReadEd = true;
        const data = pdata.data;
                if(isNaN(parseInt(pdata.data))){
                  AlertIOS.alert('您扫的二维码无效',null,()=>{
                    this.props.navigator.pop();
                  });
                }else{
                  this.MyApprovalInfo={
                    component: MyApprovalInfo,
                    params: {
                      id:data,
                      userInfo:this.props.userInfo,
                    }
                  };
                  this.props.navigator.replace(this.MyApprovalInfo);
                }


      }
  }

  render() {
    let scanArea = null
    scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
    )

    return (
      <View style={styles.cameraBlock}>

        <BarcodeScanner
          onBarCodeRead={  this.parseData.bind(this)  }
          style={styles.camera}
        >
          {scanArea}
        </BarcodeScanner>
        <TouchableHighlight style={styles.leftArrowBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this.props.navigator.pop()}}>
          <Icon name='ios-arrow-back' style={styles.leftArrow}/>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraBlock:{
    display:'flex',
    position:'relative',
    width:width,
    height:height,
  },
    camera: {
    flex: 1
  },
    rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
    rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  },
  leftArrowBlock:{
    position:'absolute',
    left:0,
    top:28,
    width:40,
    height:30,
  },
  leftArrow:{
    fontSize:24,
    color:'#fff',
    position:'absolute',
    left:15,
    top:0,
  },
});
