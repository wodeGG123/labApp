
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
  ScrollView,
} from 'react-native';

//引用模块组件
import {CommonHeader,CommonContentBlock,CommonSelect} from '../Common/index';
import userRequest,{userApi} from '../../common/request';

const {height, width} = Dimensions.get('window');
export default class MSG extends Component {
  constructor(props){
    super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataList:[],
        dataSource:ds.cloneWithRows([]),
        page:1,
      };
    this.MSGInfoScenes = {
      component: MSGInfo,
      params: {

      }
    };

  }
  componentWillMount(){
    this._getMSGList({page:1});
  }
  _paging(){
    let page = this.state.page+1;
    this._getMSGList({page:page,});
    this.setState({
      page:page,
    })
  }
  _getMSGList(obj){
    let dataList = this.state.dataList;
    userRequest.get(userApi.msgList,{page:obj.page})
    .then((data)=>{

      data.data.map((obj,index)=>{
        dataList.push(obj)
      })
      this.setState({
        dataList:dataList,
        dataSource:this.state.dataSource.cloneWithRows(dataList),
      })
    });
  }
  _showInfo(info){
    this.MSGInfoScenes = {
      component: MSGInfo,
      params: {
        info:info
      }
    };
      this.props.navigator.push(this.MSGInfoScenes);
  }
  render() {
    return (
      <View style={styles.container}>
      <CommonHeader title='消息通知' navigator={this.props.navigator}/>
        <ListView
          onEndReached={()=>{this._paging()}}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData)=>(
            <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData)}}>
            <View style={styles.itemBox}>
              <Text style={styles.itemDate}>{rowData.created_at}</Text>
              <Text style={styles.itemTitle}>{rowData.subject}</Text>
              <Text style={styles.itemTail}>{rowData.content}</Text>
            </View>
          </TouchableHighlight>
          )}
        >
        </ListView>
      </View>
    );
  }
}

class MSGInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      status:['未读','已读']
    };
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
          {this.props.info.id}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          发送人
          </Text>
          <Text style={styles.textRight}>
          {this.props.info.send_from_id}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          收信人
          </Text>
          <Text style={styles.textRight}>
          {this.props.info.send_to_id}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          状态
          </Text>
          <Text style={styles.textRight}>
            {this.state.status[this.props.info.status]}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          主题
          </Text>
          <Text style={styles.textRight}>
          {this.props.info.subject}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          内容
          </Text>
          <Text style={styles.textRight}>
          {this.props.info.content}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.textLeft}>
          发送时间
          </Text>
          <Text style={styles.textRight}>
          {this.props.info.created_at}
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
  itemBlock:{
    height:75,
    borderBottomWidth:1,
    borderColor:'#e9eaed',
    backgroundColor:'#fff',
  },
  itemBox:{
    paddingLeft:15,
    paddingRight:15,
    paddingTop:20,
    position:'relative',
  },
  itemDate:{
    position:'absolute',
    top:20,
    right:15,
    fontSize:12,
    color:'#888',
    backgroundColor:'transparent',
  },
  itemTitle:{
    fontSize:16,
    color:'#242424',
    backgroundColor:'transparent',
    width:200,
    overflow:'hidden',
    height:18,
  },
  itemTail:{
    fontSize:12,
    color:'#888',
    backgroundColor:'transparent',
    marginTop:10,
  },
  block:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',

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
    flex:2,
    backgroundColor:'transparent',
    fontSize:16,
    color:'#666',
      lineHeight:45,

        textAlign:'right',
  },
});
