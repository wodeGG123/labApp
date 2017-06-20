
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
  Modal,
} from 'react-native';

var now = new Date();
//引用模块组件
import {CommonHeader} from '../Common/index';
import userRequest,{userApi} from '../../common/request';
import dateFormat from 'dateformat';
import QRCode from 'react-native-qrcode';
import Icon from 'react-native-vector-icons/Ionicons';


const {height, width} = Dimensions.get('window');
export default class MyApplyInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      type:this.props.type,
      info:{},
      infoStatus:['提交申请','初审通过','终审通过','已借出','驳回申请','已归还'],
      infoStatusRoom:['申请成功','等待初审','未通过初审','等待终审','未通过终审'],
      QRCode: '',
      QRModal:false,
      courseList:[{
                    "name": "第1课时",
                    "id": "1",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第2课时",
                    "id": "2",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第3课时",
                    "id": "3",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第4课时",
                    "id": "4",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第5课时",
                    "id": "5",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第6课时",
                    "id": "6",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第7课时",
                    "id": "7",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第8课时",
                    "id": "8",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第9课时",
                    "id": "9",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第10课时",
                    "id": "10",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "第11课时",
                    "id": "11",
                    "isusable": false,
                    "selected": false,
                  },
                  {
                    "name": "中午",
                    "id": "4.5",
                    "isusable": false,
                    "selected": false,
                  }],

    };
  }
  componentWillMount(){
    this._getData(this.props.id);
  }
  _getData(id){
    if(this.state.type == 0){

      userRequest.get(userApi.approveListOfRoomInfo,{id:id})
      .then((data)=>{
          if(data.code == '0000'){
        this.setState({
          info:data.data,
      });
    }
    });
    }else{
      userRequest.get(userApi.MyApplyEquipmentsInfo,{id:id})
      .then((data)=>{
        if(data.code == '0000'){
          this.setState({
          info:data.data,
          QRCode: data.data.id,
        });
        }
    });
    }

  }
  _check(status,reason){
    let params = {
      id:this.state.info.id,
      status:status,
      reason:reason,
    }
    userRequest.post(userApi.checkEquipment,params)
    .then((data)=>{

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
    text => {this._check(4,text)}
  );
  }
  _showQrCode(QRModal){
    this.setState({
      QRModal:QRModal,
    })
  }
  render() {
    return ((this.state.type == 0)?<View style={styles.container}>
      <CommonHeader title='预约详情' navigator={this.props.navigator}/>
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
                <View style={styles.contentBlock}>
                {this.state.info.kakean_dt?this.state.info.kakean_dt.map((obj,index)=> (
                  <Text key={index} style={styles.contentText}>{obj.date + '【' +obj.hours.map((obj,index)=>(this.state.courseList[parseInt(obj.hour)-1].name)).join('、')+'】'}</Text>
                )):null}
                </View>
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
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.create_at ? dateFormat((new Date(parseInt(this.state.info.create_at)*1000)), "yyyy-mm-dd HH:MM:ss"):''}</Text></View>
              </View>
              <View style={styles.row1}>
                <View style={styles.contentBlock}><Text style={styles.contentText}>最后一次操作时间</Text></View>
                <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.updated_at ? dateFormat((new Date(parseInt(this.state.info.check_at)*1000)), "yyyy-mm-dd HH:MM:ss"):''}</Text></View>
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
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.audit_uid}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.notes}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                  </View>
                  :
                  <View key={index} style={styles.row1}>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.label}</Text></View>
                    <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.audit_uid}</Text></View>
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



    </View>
    :
      <View style={styles.container}>
        <CommonHeader title='预约详情' navigator={this.props.navigator}/>
        <ScrollView>
          <View style={styles.block}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>申请详情</Text>
            <TouchableHighlight style={styles.showQrCodeBox} underlayColor='transparent' onPress={()=>{this._showQrCode(true)}}>
                <Text style={styles.showQrCodeText}>查看二维码</Text>
            </TouchableHighlight>
            </View>

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
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.created_at ? dateFormat((new Date(parseInt(this.state.info.created_at)*1000)), "yyyy-mm-dd HH:MM:ss"):''}</Text></View>
                </View>
                <View style={styles.row1}>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>最后一次操作时间</Text></View>
                  <View style={styles.contentBlock}><Text style={styles.contentText}>{this.state.info.updated_at ? dateFormat((new Date(parseInt(this.state.info.updated_at)*1000)), "yyyy-mm-dd HH:MM:ss"):''}</Text></View>
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
                        <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}({obj.type})</Text></View>
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
                        <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}({obj.type})</Text></View>
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
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.audit_uid}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.audit}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                    </View>
                    :
                    <View key={index} style={styles.row1}>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.name}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.audit_uid}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.audit}</Text></View>
                      <View style={styles.contentBlock}><Text style={styles.contentText}>{obj.time}</Text></View>
                    </View>
                  )

                }):null
              }

              </View>

          </View>
          <View style={{height:15,width:width,backgroundColor:'transparent'}}></View>
        </ScrollView>
        <Modal
           animationType={"fade"}
           transparent={true}
           visible={this.state.QRModal}
           onRequestClose={() => {alert("Modal has been closed.")}}
           >
          <View style={styles.QRModal}>
          <View style={styles.QRBox}>

          <QRCode
              value={this.state.QRCode}
              size={200}
              bgColor='black'
              fgColor='white'/>
              <Text style={styles.QRText}>提供给管理员扫一扫，完成借出与归还操作</Text>
              <TouchableHighlight onPress={()=>{this._showQrCode(false)}} style={styles.QRModalCloseBox} underlayColor="transparent">
              <Icon name='ios-close-circle' style={styles.QRModalClose} />
              </TouchableHighlight>
              </View>
          </View>
         </Modal>
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
  titleBox:{
    position:'relative',
  },
  title:{
    fontSize:18,
    color:'#7b7dea',
    marginBottom:10,
    backgroundColor:'transparent',
    position:'relative',
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
  },
  showQrCodeBox:{
    width:100,
    height:25,
    borderRadius:12.5,
    backgroundColor:'#ff6e01',
    marginLeft:10,
    position:'absolute',
    top:-5,
    left:70,
  },
  showQrCodeText:{
    textAlign:'center',
    lineHeight:23,
    width:100,
    height:25,
    borderRadius:12.5,
    backgroundColor:'transparent',
    fontSize:16,
    color:'#fff',
  },
  QRModal:{
    width:width,
    height:height,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    position:'relative',
  },
  QRBox:{
    paddingTop:50,
    paddingBottom:50,
    paddingLeft:30,
    paddingRight:30,
    backgroundColor:'#fff',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    position:'relative',
    borderRadius:10,
    shadowColor:'#000',
    shadowOpacity:0.7,
    shadowRadius:10,
  },
  QRText:{
    fontSize:12,
    color:'#242424',
    textAlign:'center',
    marginTop:15,
  },
  QRModalClose:{
    fontSize:32,
    color:'#7b7dea',
    backgroundColor:'transparent',
  },
  QRModalCloseBox:{
    position:'absolute',
    right:-10,
    top:-12,
    backgroundColor:'transparent',
  },
});
