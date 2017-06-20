
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
  AlertIOS,
} from 'react-native';

var now = new Date();
//引用模块组件
import {CommonHeader,SingleBottomButton} from '../Common/index';
import userRequest,{userApi} from '../../common/request';
import dateFormat from 'dateformat';

const {height, width} = Dimensions.get('window');
export default class MyApprovalInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      userInfo:this.props.userInfo,
      info:{},
      infoStatus:['提交申请','初审通过','终审通过','已借出','驳回申请','已归还'],
      infoStatusRoom:['申请成功','等待初审','未通过初审','等待终审','未通过终审'],
      lendEQ:<View></View>,
    };
  }
  componentWillMount(){
    this._getData(this.props.id);
  }
  componentDidUpdate(){
    console.log(this.state);
  }
  _getData(id){
    userRequest.get(userApi.approveListOfEquipmentInfo,{id:id})
    .then((data)=>{console.log(data);
      if(data.code == '0000'){
        if(this.props.userInfo.type == 4){
          if(data.data.status == 2){
            this.setState({
              info:data.data,
              lendEQ:<SingleBottomButton title='借出设备' btAction={()=>{this._check(1,'')}} />,
            });
          }else if(data.data.status == 3){
            this.setState({
              info:data.data,
              lendEQ:<SingleBottomButton title='归还设备' btAction={()=>{this._check(1,'')}} />,
            });
          }else{
            this.setState({
              info:data.data
            });
          }
        }else{
          this.setState({
            info:data.data
          });
        }


      }
  });
    userRequest.get(userApi.approveListOfRoomInfo,{id:id})
    .then((data)=>{console.log(data);
        if(data.code == '0000'){
      this.setState({
      info:data.data
    });
  }
  });
  }
  _check(status,reason){
    let params = {
      id:this.state.info.id,
      status:status,
      reason:reason,
    }
    console.log(params);
    userRequest.post(userApi.checkEquipment,params)
    .then((data)=>{
      console.log(data);
      if(data.code == '0000'){
        this.props.navigator.pop();
      }
    })
    userRequest.post(userApi.checkRoom,params)
    .then((data)=>{
      console.log(data);
      if(data.code == '0000'){
        this.props.navigator.pop();
      }
    })
  }
  _allow(){
    AlertIOS.prompt(
    '备注',
    null,
    text => {this._check(1,text)}
  );
  }
  _refuse(){
    AlertIOS.prompt(
    '驳回原因',
    null,
    text => {this._check(0,text)}
  );
  }
  render() {
    return (this.state.info.lab?<View style={styles.container}>
      <CommonHeader title='审批详情' navigator={this.props.navigator}/>
      <ScrollView>
        <View style={styles.block}>
            <Text style={styles.title}>预约列表</Text>
            <View style={styles.rowBlock}>
              <View style={styles.row1}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>预约人</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.userid}</Text></View>
              </View>
              <View style={styles.row2}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>指导老师</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.teacher}</Text></View>
              </View>
              <View style={styles.row1}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>实验室名称</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.lab}</Text></View>
              </View>
              <View style={styles.row2}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>预约时间</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.kakean_dt[0].date}</Text></View>
              </View>
              <View style={styles.row2}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>申请理由及备注</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.info}</Text></View>
              </View>
              <View style={styles.row1}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>状态</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.infoStatusRoom[this.state.info.status]}</Text></View>
              </View>
              <View style={styles.row2}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>申请时间</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.create_at ? dateFormat((new Date(parseInt(this.state.info.create_at)*1000)), "yyyy-mm-dd h:MM:ss"):''}</Text></View>
              </View>
              <View style={styles.row1}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>最后一次操作时间</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.updated_at ? dateFormat((new Date(parseInt(this.state.info.check_at)*1000)), "yyyy-mm-dd h:MM:ss"):''}</Text></View>
              </View>
            </View>
        </View>


        <View style={styles.block}>
            <Text style={styles.title}>操作记录</Text>
            <View style={styles.rowBlock}>
            <View style={styles.row1}>
              <View style={styles.contentBlock}><Text style={styles.contentText}>事件</Text></View>
              <View style={styles.contentBlock}><Text style={styles.contentText}>处理人</Text></View>
              <View style={styles.contentBlock}><Text style={styles.contentText}>备注</Text></View>
              <View style={styles.contentBlock}><Text style={styles.contentText}>时间</Text></View>
            </View>
            {
              this.state.info.check_at
              ?
              this.state.info.check_at.map((obj,index)=>{


                return(
                  index%2==0?
                  <View key={index} style={styles.row2}>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.label}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>处理人</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.notes}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                  </View>
                  :
                  <View key={index} style={styles.row1}>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.label}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>处理人</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.notes}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                  </View>
                )

              }):null
            }

            </View>

        </View>
        <View style={{height:15,width:width,backgroundColor:'transparent'}}></View>
      </ScrollView>
      {this.state.info.needcheck?<ToolButtoms allowText={'通过'} refuseText={'驳回'} allowAction={()=>this._allow()} refuseAction={()=>this._refuse()} />:<View></View>}

    </View>
    :
      <View style={styles.container}>
        <CommonHeader title='审批详情' navigator={this.props.navigator}/>
        <ScrollView>
          <View style={styles.block}>
              <Text style={styles.title}>申请详情</Text>
              <View style={styles.rowBlock}>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>借用人</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.user_id}</Text></View>
                </View>
                <View style={styles.row2}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>指导老师</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.teacher_id}</Text></View>
                </View>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>所属实验室</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.lab_id}（{this.state.info.lab_code}）</Text></View>
                </View>
                <View style={styles.row2}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>借用开始时间</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.borrow_start}</Text></View>
                </View>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>借用结束时间</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.borrow_end}</Text></View>
                </View>
                <View style={styles.row2}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>申请理由及备注</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.reason}</Text></View>
                </View>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>状态</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.infoStatus[this.state.info.status]}</Text></View>
                </View>
                <View style={styles.row2}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>申请时间</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.created_at ? dateFormat((new Date(parseInt(this.state.info.created_at)*1000)), "yyyy-mm-dd h:MM:ss"):''}</Text></View>
                </View>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>最后一次操作时间</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.updated_at ? dateFormat((new Date(parseInt(this.state.info.updated_at)*1000)), "yyyy-mm-dd h:MM:ss"):''}</Text></View>
                </View>
              </View>
          </View>

          <View style={styles.block}>
              <Text style={styles.title}>设备详情</Text>
              <View style={styles.rowBlock}>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>设备名称</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>设备编号</Text></View>
                </View>

                {
                  this.state.info.equipments?
                  this.state.info.equipments.map((obj,index)=>{

                    return (
                      index%2==0?
                      <View key={index} style={styles.row2}>
                        <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}</Text></View>
                        <View style={styles.contentBlock}>
                        <Text style={styles.contentText}>
                        {
                          obj.serial.map((data,i)=>{
                            return(
                              i==(obj.serial.length-1)?
                              data.serial:data.serial+'、'
                            )
                          })
                        }
                       </Text>

                        </View>
                      </View>
                      :
                      <View key={index} style={styles.row1}>
                        <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}</Text></View>
                        <View style={styles.contentBlock}>
                        <Text style={styles.contentText}>
                        {
                          obj.serial.map((data,i)=>{
                            return(
                              i==(obj.serial.length-1)?
                              data.serial:data.serial+'、'
                            )
                          })
                        }
                       </Text>

                        </View>
                      </View>
                    )
                  })
                  :null
                }


              </View>
          </View>

          <View style={styles.block}>
              <Text style={styles.title}>操作记录</Text>
              <View style={styles.rowBlock}>
              <View style={styles.row1}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>事件</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>处理人</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>备注</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>时间</Text></View>
              </View>
              {
                this.state.info.check_at
                ?
                this.state.info.check_at.map((obj,index)=>{


                  return(
                    index%2==0?
                    <View key={index} style={styles.row2}>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>处理人</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>备注</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                    </View>
                    :
                    <View key={index} style={styles.row1}>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>处理人</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>备注</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                    </View>
                  )

                }):null
              }

              </View>

          </View>
          <View style={{height:15,width:width,backgroundColor:'transparent'}}></View>
        </ScrollView>
        {this.state.info.needcheck?<ToolButtoms allowText={'通过'} refuseText={'驳回'} allowAction={()=>this._allow()} refuseAction={()=>this._refuse()} />:<View></View>}
        {this.state.lendEQ}

      </View>
    );
  }
}
class ToolButtoms extends Component {
  constructor(props){
    super(props);
    this.state={

    };
  }
  render(){
    return (
      <View style={styles.toolButtomsBlock}>
        <TouchableHighlight style={styles.toolButtom} onPress={()=>this.props.allowAction()}>
          <View style={{backgroundColor:'#7b7dea'}}>
            <Text style={styles.toolButtomText}>{this.props.allowText}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.toolButtom} onPress={()=>this.props.refuseAction()}>
          <View style={{backgroundColor:'#00c6ff'}}>
            <Text style={styles.toolButtomText}>{this.props.refuseText}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width:width,
    height:height,
    backgroundColor:'#eff3f6',
  },
  block:{
    marginTop:15,
    borderWidth:15,
    borderColor:'#fff',
    backgroundColor:'#fff',
  },
  title:{
    fontSize:18,
    color:'#7b7dea',
    marginBottom:10,
    backgroundColor:'transparent',
  },
  rowBlock:{
    borderTopWidth:1,
    borderLeftWidth:1,
    borderColor:'#e9eaed',
  },
  row1:{
    backgroundColor:'#f7f8fd',
    display:'flex',
    justifyContent:'flex-start',
    flexDirection:'row',
  },
  row2:{
    backgroundColor:'#fff',
    display:'flex',
    justifyContent:'flex-start',
    flexDirection:'row',
  },
  contentBlock:{
    borderBottomWidth:1,
    borderRightWidth:1,
    borderColor:'#e9eaed',
    flex:1,
    padding:10,
  },
  toolButtomsBlock:{
    display:'flex',
    justifyContent:'flex-start',
    flexDirection:'row',
  },
  toolButtom:{
    flex:1,
    height:50,
  },
  toolButtomText:{
    fontSize:18,
    color:'#fff',
    lineHeight:50,
    textAlign:'center',
    backgroundColor:'transparent',
  }
});
