
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
import MyApplyInfo from '../MyApplyInfo/index';
import _ from 'lodash';

const {height, width} = Dimensions.get('window');
export default class MyApply extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        type:this.props.type,
        dataSource:ds.cloneWithRows([]),
        selectID:0,
        listStatus:['提交申请','初审通过','终审通过','已借出','驳回申请','已归还'],
        listStatus2:['申请成功','等待初审','未通过初审','等待终审','未通过终审'],
        sourceUrl:this.props.sourceUrl,
        id:this.props.userId,
        page:1,
        dataList:[],
    };
    this.MyApplyInfo={
      component: MyApplyInfo,
      params: {

      }
    };
  }
  componentWillMount(){
    this._getData({url:this.state.sourceUrl});
  }
  componentDidUpdate(){
  }
  _paging(){
    let page = this.state.page+1;
    if(this.state.type == 0){
      this._getData({url:userApi.approveListOfRoom,page:page,});
    }else{
      this._getData({url:userApi.MyApplyEquipments,page:page,});
    }
    this.setState({
      page:page,
    })
  }
  _getData(obj){
      let dataList = this.state.dataList;
      userRequest.get(obj.url,{page:obj.page})
      .then((data)=>{
        if(data.data.data){
          data.data.data.map((obj,index)=>{
              dataList.push(obj);
          });
          this.setState({
            dataList:dataList,
            dataSource:this.state.dataSource.cloneWithRows(dataList),
          })
        }else{
          data.data.map((obj,index)=>{
              dataList.push(obj);
          });
          this.setState({
            dataList:dataList,
            dataSource:this.state.dataSource.cloneWithRows(dataList),
          })
        }

      });

  }
  _showInfo(infoId,type){
    this.MyApplyInfo={
      component: MyApplyInfo,
      params: {
        id:infoId,
        type:type,
      }
    };
    this.props.navigator.push(this.MyApplyInfo);
  }
  render() {

    return (
      <View style={styles.container}>
      <CommonHeader title={this.props.pageTitle} navigator={this.props.navigator}/>
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
                          <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData.id,this.state.type)}}>
                          <View style={styles.itemBox}>
                            <Icon name="ios-arrow-forward" style={styles.itemRightBt}/>
                            <Text style={styles.itemTitle}>{rowData.lab}</Text>
                            <Text style={styles.itemTail}><Text>发起人：{rowData.userid}</Text>&nbsp;&nbsp;&nbsp;&nbsp;<Text style={{marginLeft:10}}>状态：{this.state.listStatus2[rowData.status]}</Text></Text>
                          </View>
                        </TouchableHighlight>

                  :
                  <TouchableHighlight key={rowData.id} style={styles.itemBlock}  activeOpacity={1} underlayColor={'white'} onPress={()=>{this._showInfo(rowData.id,this.state.type)}}>
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
              <Text style={styles.eptText}>你还没有申请的信息</Text>
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
