
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
import _ from 'lodash';

const {height, width} = Dimensions.get('window');
export default class MyApproval extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSourceList:[],
        dataSource:ds.cloneWithRows([]),
        dataSourceEq: ds.cloneWithRows([]),
        dataSourceRoom: ds.cloneWithRows([]),
        selectID:0,
        listStatus:['提交申请','初审通过','终审通过','已借出','驳回申请','已归还'],
        listStatus2:['申请成功','等待初审','未通过初审','等待终审','未通过终审'],
        page:1,
        needcheck:'',

    };
    this.MyApprovalInfo={
      component: MyApprovalInfo,
      params: {

      }
    };
  }
  componentWillMount(){
    this._getData({url:userApi.approveListOfEquipment,type:0,},1);
    this._getData({url:userApi.approveListOfRoom,type:1,},1);
  }
  componentDidUpdate(){

  }
  _paging(){
    let page = this.state.page+1;
    this._getData({url:userApi.approveListOfEquipment,type:0,page:page,},this.state.needcheck);
    this._getData({url:userApi.approveListOfRoom,type:1,page:page,},this.state.needcheck);
    this.setState({
      page:page,
    })
  }
  _getData(obj,needcheck){

  if(obj.type==0){
      userRequest.get(obj.url,{needcheck:needcheck,page:obj.page})
      .then((data)=>{

        const dataSourceList = _.cloneDeep(this.state.dataSourceList);
        data.data.map((obj,index)=>{
          dataSourceList.push(obj);
        })
        this.setState({
          dataSourceList:dataSourceList,
          dataSourceEq:this.state.dataSourceEq.cloneWithRows(data.data),
          dataSource:this.state.dataSource.cloneWithRows(dataSourceList),
        })
      });
    }else if(obj.type ==1){
      userRequest.get(obj.url,{check:1,needcheck:needcheck,page:obj.page})
      .then((data)=>{

        const dataSourceList = _.cloneDeep(this.state.dataSourceList);
        data.data.data.map((obj,index)=>{
          dataSourceList.push(obj);
        })


        this.setState({
          dataSourceList:dataSourceList,
          dataSourceRoom:this.state.dataSourceRoom.cloneWithRows(data.data.data),
          dataSource:this.state.dataSource.cloneWithRows(dataSourceList),
        })
      });
    }
  }
  _showInfo(infoId,type){
    this.MyApprovalInfo={
      component: MyApprovalInfo,
      params: {
        id:infoId,
        userInfo:this.props.userInfo,
        type:type,
      }
    };
    this.props.navigator.push(this.MyApprovalInfo);
  }
  _changeTab(index){
    this.setState({
      dataSourceList:[],
      dataSourceEq:this.state.dataSourceEq.cloneWithRows([]),
      dataSourceRoom:this.state.dataSourceRoom.cloneWithRows([]),
      dataSource:this.state.dataSource.cloneWithRows([]),
    })
    if(index != this.state.selectID){
      if(index==0){
        this.setState({
          selectID:index,
          needcheck:1,
        });
        this._getData({url:userApi.approveListOfEquipment,type:0,},1);
        this._getData({url:userApi.approveListOfRoom,type:1,},1);
      }else{
        this.setState({
          selectID:index,
          needcheck:'',
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
        this.state.dataSource._cachedRowCount > 0 ?

          <ListView
            onEndReached={()=>{this._paging()}}
            onEndReachedThreshold={20}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>{
                return (
                  rowData.lab?

                          <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData.id,0)}}>
                          <View style={styles.itemBox}>
                            <Icon name="ios-arrow-forward" style={styles.itemRightBt}/>
                            <Text style={styles.itemTitle}>{rowData.lab}</Text>
                            <Text style={styles.itemTail}><Text>发起人：{rowData.userid}</Text>&nbsp;&nbsp;&nbsp;&nbsp;<Text style={{marginLeft:10}}>状态：{this.state.listStatus2[rowData.status]}</Text></Text>
                          </View>
                        </TouchableHighlight>

                  :
                  <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData.id,1)}}>
                  <View style={styles.itemBox}>
                    <Icon name="ios-arrow-forward" style={styles.itemRightBt}/>
                    <Text style={styles.itemTitle}>{rowData.name}</Text>
                    <Text style={styles.itemTail}><Text>发起人：{rowData.userid}</Text>&nbsp;&nbsp;&nbsp;&nbsp;<Text style={{marginLeft:10}}>状态：{this.state.listStatus[rowData.status]}</Text></Text>
                  </View>
                </TouchableHighlight>
                )}
                }
          />


        :
            <View style={styles.eptBlock}>
              <Image source={require('./img/empty-icon.png')} resizeMode='contain' style={styles.eptImg} />
              <Text style={styles.eptText}>你还没有需审批的信息</Text>
            </View>
      }
      <View style={{width:width,height:25,backgroundColor:'#eee'}}></View>
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
