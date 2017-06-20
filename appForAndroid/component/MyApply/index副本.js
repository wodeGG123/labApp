
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
} from 'react-native';


//引用模块组件
import {CommonHeader,CommonContentBlock,CommonSelect,CommonTabs} from '../Common/index';
import Icon from 'react-native-vector-icons/Ionicons';
import userRequest,{userApi} from '../../common/request';
import MyApprovalInfo from '../MyApprovalInfo/index';

const {height, width} = Dimensions.get('window');
export default class MyApproval extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSourceEq: ds.cloneWithRows([]),
        dataSourceRoom: ds.cloneWithRows([]),
        selectID:0,
        listStatus:['提交申请','初审通过','终审通过','已借出','驳回申请','已归还'],
        listStatus2:['申请成功','等待初审','未通过初审','等待终审','未通过终审'],

    };
    this.MyApprovalInfo={
      component: MyApprovalInfo,
      params: {

      }
    };
  }
  componentWillMount(){
    this._getData({url:userApi.approveListOfEquipment,type:0,},0);
    this._getData({url:userApi.approveListOfRoom,type:1,},1);
  }
  _getData(obj,status){

  if(obj.type==0){
      userRequest.get(obj.url,{status:status})
      .then((data)=>{
        this.setState({
          dataSourceEq:this.state.dataSourceEq.cloneWithRows(data.data),
        })
      });
    }else if(obj.type ==1){
      userRequest.get(obj.url,{check:1,status:status})
      .then((data)=>{
        console.log(data);
        this.setState({
          dataSourceRoom:this.state.dataSourceRoom.cloneWithRows(data.data.data),
        })
      });
    }
  }
  _showInfo(infoId){
    this.MyApprovalInfo={
      component: MyApprovalInfo,
      params: {
        id:infoId
      }
    };
    console.log(this.MyApprovalInfo);
    this.props.navigator.push(this.MyApprovalInfo);
  }
  _changeTab(index){
    this.setState({
      dataSourceEq:this.state.dataSourceEq.cloneWithRows([]),
      dataSourceRoom:this.state.dataSourceRoom.cloneWithRows([])
    })
    if(index != this.state.selectID){
      if(index==0){
        this.setState({
          selectID:index,
        });
        this._getData({url:userApi.approveListOfEquipment,type:0,},0);
        this._getData({url:userApi.approveListOfRoom,type:1,},1);
      }else{
        this.setState({
          selectID:index,
        });
        this._getData({url:userApi.approveListOfEquipment,type:0,},'');
        this._getData({url:userApi.approveListOfRoom,type:1,},'');
      }

    }
  }
  render() {

    return (
      <View style={styles.container}>
      <CommonHeader title='我的审批' navigator={this.props.navigator}/>
      <CommonTabs TabItems={[{name:'待审批'},{name:'我的审批'}]} selectID={this.state.selectID} changeTab={(index)=>this._changeTab(index)} />
      {
        this.state.dataSourceEq._cachedRowCount > 0 ?
        <View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSourceEq}
            renderRow={(rowData) =>
                (
                  <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData.id)}}>
                  <View style={styles.itemBox}>
                    <Icon name="ios-arrow-forward" style={styles.itemRightBt}/>
                    <Text style={styles.itemTitle}>{rowData.name}（{rowData.type}）</Text>
                    <Text style={styles.itemTail}><Text>发起人：{rowData.student}</Text>&nbsp;&nbsp;&nbsp;&nbsp;<Text style={{marginLeft:10}}>状态：{this.state.listStatus[rowData.status]}</Text></Text>
                  </View>
                </TouchableHighlight>
                )}
          />
          <ListView
          enableEmptySections={true}
            dataSource={this.state.dataSourceRoom}
            renderRow={(rowData) =>
                (
                  <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData.id)}}>
                  <View style={styles.itemBox}>
                    <Icon name="ios-arrow-forward" style={styles.itemRightBt}/>
                    <Text style={styles.itemTitle}>{rowData.lab}</Text>
                    <Text style={styles.itemTail}><Text>发起人：{rowData.userid}</Text>&nbsp;&nbsp;&nbsp;&nbsp;<Text style={{marginLeft:10}}>状态：{this.state.listStatus2[rowData.status]}</Text></Text>
                  </View>
                </TouchableHighlight>
                )}
          />
          </View>
        :
            <View style={styles.eptBlock}>
              <Image source={require('./img/empty-icon.png')} resizeMode='contain' style={styles.eptImg} />
              <Text style={styles.eptText}>你还没有需审批的信息</Text>
            </View>
      }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width:width,
    height:height,
    backgroundColor:'#eff3f6',
  },
  itemBlock:{

    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:'#e9eaed',
    backgroundColor:'white',
    marginTop:10,
    position:'relative',
  },
  itemBox:{
    borderWidth:15,
    borderColor:"white",
  },
  itemTitle:{
    fontSize:16,
    color:'#242424',
  },
  itemTail:{
    fontSize:12,
    color:'#888',
    marginTop:8,
  },
  itemRightBt:{
    position:'absolute',
    right:0,
    top:10,
    fontSize:24,
    color:'#242424',
    zIndex:1,
  },
  eptBlock:{
    width:width,
    height:height-64-50,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  eptImg:{
    width:70,
    height:70,
  },
  eptText:{
    marginTop:15,
    fontSize:16,
    color:'#888',
  },
});
