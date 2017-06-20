
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
} from 'react-native';



//引用模块组件
import {CommonHeader,CommonContentBlock,CommonSelect} from '../Common/index';

const {height, width} = Dimensions.get('window');
export default class MSGInfo extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
      <CommonHeader title='消息通知详情' navigator={this.props.navigator}/>
      <ScrollView>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          消息ID
          </Text>
          <Text style={styles.textRight}>
          奔跑的蚂蚁
          </Text>
        </View>
      </ScrollView>
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
    height:45,
    borderBottomWidth:1,
    borderColor:'#e9eaed',
    paddingLeft:15,
    paddingRight:15,
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
        height:45,
        textAlign:'right',
  },

});
