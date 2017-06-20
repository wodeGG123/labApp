
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  Navigator,
  TouchableHighlight,
  Modal,
  DatePickerAndroid,
  ListView,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';


import userRequest,{userApi} from '../../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import dateFormat from 'dateformat';
const {height, width} = Dimensions.get('window');


//引用模块组件
import {CommonHeader,CommonContentBlock,SingleBottomButton} from '../Common/index';
export default class ApplyLab extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
        userInfo:this.props.userInfo,//用户信息
        tips:'',//提示信息
        modalRoom: false,//选择实验室弹出层
        modalTeacher: false,//选择指导老师弹出层
        room:false,//已选择的实验室
        teacher:false,//已选择的指导老师
        modalDate:false,//选择日期弹出层
        date:new Date((+new Date())+1000*24*60*60),//当前日期加一天（由于预约必须从明天开始）
        dateTimeList:[],//已选时间列表
        dateFormatText:'',//已选日期的文字展示模式
        remarks:'',//申请备注信息
        timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,//日期插件初始化变量
        timeSource: ds.cloneWithRows([]),//
        courseListTemp:[],//课时列表模板
        dateTimeTemp:{
          time:'',
          dateFormatText:'',
          courseText:'',
          date:new Date((+new Date())+1000*24*60*60),
          courseListSource: ds.cloneWithRows([]),
          courseList:[],
          _new:true,
          index:0,
        },//日期模板
        newDateTime:{
          time:'',
          index:0,
          _new:true,
          courseText:'',
          dateFormatText:'',
          courseListSource: ds.cloneWithRows([]),
          date:new Date((+new Date())+1000*24*60*60),
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

        },//新日期模板
    };
  }
  componentWillMount(){
    if(this.state.userInfo.type == 2){
      this.setState({
          teacher:this.state.userInfo.id,
      })
    }

    let tipsDate = new Date((+new Date())+1000*24*60*60*this.state.userInfo.settings.BorrowDayLab);
    tipsDate = dateFormat(tipsDate,'yyyy年mm月dd日');
    const tips = '可预约明日至'+ tipsDate +'的可用设备，每次最多可借用'+ this.state.userInfo.settings.MaxBorrowDayLab +'天。';
    this.setState({
        tips:tips
    })

  }
  componentDidUpdate(){

  }
  _setRoomSelect(data){
    userRequest.get(userApi.equipmentOfRoom,{id:data.id})
    .then((eq)=>{data.equipment = eq.data;this.setState({
      modalRoom: false,
      room:data,
    })});
  }
  _setTeacherSelect(data){
    this.setState({
      modalTeacher: false,
      teacher:data,
    })
  }
  _selectDate(modalDate,_new,_index){
    if(!this.state.room){
      Alert.alert(
        '提示',
        '请先选择实验室！',
        );
      return;
    }
    if(!this.state.teacher){
      Alert.alert(
         '提示',
         '请先选择指导老师！',
        );
      return;
    }

    if(!modalDate){
      const dateTimeTemp = _.cloneDeep(this.state.dateTimeTemp);
      const dateTimeList = _.cloneDeep(this.state.dateTimeList);
      if(dateTimeList.length>=this.state.userInfo.settings.MaxBorrowDayLab){
        Alert.alert('提示',"超过天数限制！",[{text:'ok',onPress:()=>{
          this.setState({
            modalDate:modalDate,
          })
        }}]);
        return ;
      }
      if(dateTimeTemp._new){
        let _flag = false;
        dateTimeList.map((obj,index)=>{
          if(obj.dateFormatText == dateTimeTemp.dateFormatText){
            _flag = true;
          }

        });
        if(_flag){
          Alert.alert('提示','此日期您已经选过了！',[{text:'ok',onPress:()=>{
            this.setState({
              modalDate:modalDate,
            })
          }}]);
          return;
        }
      }else{
        let _flag = false;
        dateTimeList.map((obj,index)=>{
          if(obj.dateFormatText == dateTimeTemp.dateFormatText && obj.index != dateTimeTemp.index){
            _flag = true;
          }

        });
        if(_flag){
          Alert.alert('提示','此日期您已经选过了！',[{text:'ok',onPress:()=>{
            this.setState({
              modalDate:modalDate,
            })
          }}]);
          return;
        }
      }


      const courseText = '';
      const selected = false;
      let courseArray = [];
      courseText += '【';

       dateTimeTemp.courseList.map((obj,index)=>{
        if(obj.selected){
          selected = true;
          courseArray.push(obj.name);
        }
      });
      courseText += courseArray.join('、');
      courseText += '】';
      dateTimeTemp.courseText = courseText;
      if(selected){
        if(dateTimeTemp._new){
          dateTimeTemp.index = dateTimeList.length;
          dateTimeList.push(dateTimeTemp);
        }else{
          dateTimeList[dateTimeTemp.index] = dateTimeTemp;
        }
        this.setState({
          modalDate:modalDate,
          dateTimeList:dateTimeList,
        });
      }else{
        let dateTimeListChange = [];
        dateTimeList.map((obj,index)=>{
          if(index!=dateTimeTemp.index){
            dateTimeListChange.push(obj);
          }
        });
        this.setState({
          modalDate:modalDate,
          dateTimeList:dateTimeListChange,
        });
      }

    }else{
      const dateTimeTemp = _new?_.cloneDeep(this.state.newDateTime):_.cloneDeep(this.state.dateTimeList[_index]);
      if(_new){
        dateTimeTemp._new = true;
        const dateFormatText = dateFormat(dateTimeTemp.date,'yyyy-mm-dd');
        dateTimeTemp.dateFormatText = dateFormatText;
        userRequest.get(userApi.getCourse,{date:dateFormatText,lab:this.state.room.id,teacher:this.state.teacher.id})
        .then((data)=>{
          if(data.code == '0000'){
          dateTimeTemp.courseList.map((obj,index)=>{
            data.data.map((obj2,index2)=>{
              if(obj.id == obj2){
                dateTimeTemp.courseList[index].isusable = true;
              }
            })
          });
          dateTimeTemp.courseListSource = _.cloneDeep(dateTimeTemp.courseListSource.cloneWithRows(dateTimeTemp.courseList));
          this.setState({
            dateTimeTemp:dateTimeTemp,
          })

          }
        });
      }else{
        dateTimeTemp._new = false;
      }
      dateTimeTemp.courseListSource = _.cloneDeep(dateTimeTemp.courseListSource.cloneWithRows(dateTimeTemp.courseList));
      this.setState({
        modalDate:modalDate,
        dateTimeTemp:dateTimeTemp,
      });
    }
  }
  _selectCourse(id){
    const dateTimeTemp = _.cloneDeep(this.state.dateTimeTemp);//利用lodash 深度拷贝
    dateTimeTemp.courseList[id].selected = !dateTimeTemp.courseList[id].selected;
    if(dateTimeTemp.courseList[id].selected){
      const time = dateTimeTemp.time;
      time += dateTimeTemp.courseList[id].id+':';
      dateTimeTemp.time = time;
    }
    dateTimeTemp.courseListSource = _.cloneDeep(dateTimeTemp.courseListSource.cloneWithRows(dateTimeTemp.courseList));

    this.setState({
      dateTimeTemp:dateTimeTemp,
    });
  }
  onDateChange(date){
    const dateFormatText = dateFormat(date,'yyyy-mm-dd');
    const dateTimeTemp = _.cloneDeep(this.state.dateTimeTemp);
    dateTimeTemp.date = date;
    dateTimeTemp.dateFormatText = dateFormatText;
    dateTimeTemp.courseList = _.cloneDeep(this.state.newDateTime.courseList);
    dateTimeTemp.time = '';
    this.setState({
      dateTimeTemp:dateTimeTemp,
    })
    userRequest.get(userApi.getCourse,{date:dateFormatText,lab:this.state.room.id,teacher:this.state.teacher.id})
    .then((data)=>{

      if(data.code == '0000'){

      dateTimeTemp.courseList.map((obj,index)=>{
        data.data.map((obj2,index2)=>{
          if(obj.id == obj2){
            dateTimeTemp.courseList[index].isusable = true;
          }
        })
      });

      dateTimeTemp.courseListSource = _.cloneDeep(dateTimeTemp.courseListSource.cloneWithRows(dateTimeTemp.courseList));
      this.setState({
        dateTimeTemp:dateTimeTemp,
      })

      }
    });
  }
  _submit(){

    if(!this.state.room || !this.state.dateTimeList[0] || !this.state.teacher){
      Alert.alert('提示','请完善信息后提交！');
      return ;
    }

    const time = this.state.dateTimeList.map((obj,index)=>{
      return obj.dateFormatText+"/"+obj.time.substr(0,obj.time.length-1)
    }).join('|');
    userRequest.post(userApi.applyRoom,{
      lab:this.state.room.id,
      teacher:this.state.teacher.id,
      kakean_dt:time,
      objective:this.state.remarks,
      info:this.state.remarks,
      period:'12',
    })
    .then((data)=>{
      if(data.code == '0000'){
        Alert.alert('提示','申请成功！');
        this.props.navigator.pop();
      }
      });
  }
  _closeRoomSelect(){
    this.setState({
      modalRoom: false,
    })
  }
  _closeTeacherSelect(){
    this.setState({
      modalTeacher: false,
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <CommonHeader title='实验室预约申请' navigator={this.props.navigator}/>
        <CommonContentBlock>
          <Text style={styles.applyTitle}>
            实验室预约申请
          </Text>
          <View style={styles.tipsBlock}>
            <Text style={styles.tips}>
              {this.state.tips}
            </Text>
          </View>
          {/* 选择实验室 */}
        <View style={styles.formBlock}>
          <Text style={styles.title}>
            选择实验室
          </Text>
          <TouchableHighlight style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this.setState({modalRoom:true})}}>
            <Text style={styles.selectText}>
              {this.state.room?this.state.room.name+'【'+ this.state.room.equipment.map((obj,index)=> (obj.name)).join('、') +'】':'请选择--'}
            </Text>
          </TouchableHighlight>
        </View>
        {/* 选择实验室 */}
        {/* 选择指导老师 */}
        {
          this.state.userInfo.type == 2?null:<View style={styles.formBlock}>
            <Text style={styles.title}>
              选择指导老师
            </Text>
            <TouchableHighlight style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this.setState({modalTeacher:true})}}>
              <Text style={styles.selectText}>
                {this.state.teacher?this.state.teacher.username:'请选择--'}
              </Text>
            </TouchableHighlight>
          </View>
        }

      {/* 选择指导老师 */}
          {/* 选择日期 */}
          <View style={styles.formBlock}>
            <Text style={styles.title}>
              日期选择
            </Text>
            {
              this.state.dateTimeList.map((data,index)=>(
                <TouchableHighlight key={index} style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._selectDate(true,false,index)}}>
                  <Text style={styles.selectText}>
                    {data.dateFormatText+data.courseText}
                  </Text>
                </TouchableHighlight>
              ))
            }
            <TouchableHighlight style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._selectDate(true,true)}}>
              <Text style={styles.selectText}>
                {'请选择日期--'}
              </Text>
            </TouchableHighlight>

          </View>
          {/* 选择日期 */}


          {/* 备注 */}
        <View style={styles.formBlock}>
          <Text style={styles.title}>
            备注
          </Text>
          <View style={styles.selectBlock}>

            <TextInput
            underlineColorAndroid='transparent'
            style={styles.remarks}
            onChangeText={(remarks) => this.setState({remarks})}
            value={this.state.remarks}
            placeholder={'请输入备注'}
            />

          </View>
        </View>
        <View style={{width:width,height:40}}></View>
        {/* 备注 */}
        </CommonContentBlock>
        <TouchableHighlight style={styles.submit} activeOpacity={0.6} underlayColor={'#7b7dea'} onPress={()=> {this._submit()}}>
          <Text style={styles.submitText}>
            提交申请
          </Text>
        </TouchableHighlight>
        <View style={{width:width,height:25,backgroundColor:'#eee'}}></View>
        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalDate}
          onRequestClose={() => {}}
          >
          <CommonHeader title='选择日期' backIcon={false} navigator={this.props.navigator}/>
          <View style={{backgroundColor:'#fff',height:50,borderBottomWidth:1,borderBottomColor:'#eee',}}>
          <TouchableHighlight style={styles.dateSelect} activeOpacity={0.6} underlayColor={'#7b7dea'} onPress={async ()=> {

            try {
              const {action, year, month, day} = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                date: this.state.dateTimeTemp.date,
                minDate:this.state.date,
                maxDate:new Date((+this.state.date)+1000*24*60*60*parseInt(29)),
              });

              if (action === DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
              }else{
                this.onDateChange(new Date(year,month,day));
              }
            } catch ({code, message}) {
              console.warn('Cannot open date picker', message);
            }

          }}>
            <Text style={styles.dateSelectText}>
              {dateFormat(this.state.dateTimeTemp.date,'yyyy年mm月dd日')}
            </Text>
          </TouchableHighlight>
              {/*
              <DatePickerAndroid
                date={this.state.dateTimeTemp.date}
                minimumDate={this.state.date}
                maximumDate={new Date((+this.state.date)+1000*24*60*60*parseInt(30))}
                mode="date"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={(date)=>{this.onDateChange(date)}}
                minuteInterval={10}
              />
              */}
          </View>

          <ListView
            style={{height:300,}}
            enableEmptySections={true}
            dataSource={this.state.dateTimeTemp.courseListSource}
            renderRow={(rowData,sectionID,rowID) =>
              (rowData.isusable?
                <TouchableHighlight activeOpacity={0.6} underlayColor={'transparent'}  onPress={()=>{this._selectCourse(rowID)}} style={styles.courseListBlock}><View style={styles.courseListLeft}><Text style={styles.courseListLeftText}>{rowData.name}</Text><Icon  style={styles.courseListRightIcon} name={rowData.selected?'ios-checkmark-circle':'ios-checkmark-circle-outline'} /></View></TouchableHighlight>
                :
                <View style={styles.courseListBlock}><View style={styles.courseListLeft}><Text style={styles.courseListLeftText}>{rowData.name}</Text></View><View style={styles.courseListRight}><Text style={styles.courseListRightText}>（不可预约）</Text></View></View>
              )


          }
          />
          <SingleBottomButton title='确认' btAction={()=>{this._selectDate(false)}}/>
        </Modal>
        {/* 实验室modal*/}
        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalRoom}
          onRequestClose={() => {}}
          >
            <OneSelect selectEd={this.state.room} closeModal={()=>{this._closeRoomSelect()}} selectAction={(data)=>{this._setRoomSelect(data)}} dataUrl={userApi.roomList} textName='name' title='选择实验室'/>
        </Modal>
  {/* 实验室modal*/}
    {/* 指导老师modal*/}
        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalTeacher}
          onRequestClose={() => {}}
          >
            <OneSelect selectEd={this.state.teacher} closeModal={()=>{this._closeTeacherSelect()}} selectAction={(data)=>{this._setTeacherSelect(data)}} dataUrl={userApi.teacherList} textName='username' title='选择指导老师'/>
        </Modal>
          {/* 指导老师modal*/}
      </View>
    );
  }
}

//select组件
class OneSelect extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
       dataSource: ds.cloneWithRows([]),
       selected:this.props.selectEd,
       searchText:'',
    };
  }
  componentWillMount(){
    userRequest.post(this.props.dataUrl)
    .then((data)=>{
      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(data.data),
      })
    });
  }
  _selectItem(data){
    this.setState({
      selected:data,
    });
    //选择完成之后执行传参，并且关闭当前modal
    this.props.selectAction(data);
  }
  _search(text){
    const _text = text.replace(/\s/g,',');
    userRequest.get(this.props.dataUrl,{name:_text,username:_text})
    .then((data)=>{

      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(data.data),
      })
    });
    this.setState({
      searchText:text,
    });
  }
  _searchCancel(){
    this.setState({
      searchText:'',
    })
  }
  componentDidUpdate(){

  }
  render() {
    return (
        <View style={{width:width,height:height,backgroundColor:'#eff3f6',}}>
        <View style={styles.searchHeader}>
          <View style={styles.searchHeaderLeft}>
            <Icon name='ios-search' style={styles.searchHeaderIcon} />
            <TextInput
            underlineColorAndroid='transparent'
            onChangeText={(text)=>{this._search(text)}}
            style={styles.searchHeaderInput}
            value={this.state.searchText}
            placeholder='搜索..'
            />
          </View>
          <TouchableHighlight style={styles.searchHeaderCancel} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._searchCancel()}}>
              <Text style={styles.searchHeaderCancelText}>取消</Text>
          </TouchableHighlight>
        </View>
            <ListView
              enableEmptySections={true}
              scrollEventThrottle={200}
              dataSource={this.state.dataSource}
              renderRow={(rowData) => (
                <TouchableHighlight style={styles.searchItem} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._selectItem(rowData)}}>
                    <Text style={styles.searchItemText}>{eval('rowData.' + this.props.textName)}</Text>
                </TouchableHighlight>
              )}
            />
            <SingleBottomButton title='关闭' btAction={()=>{this.props.closeModal()}} />
            <View style={{width:width,height:25,backgroundColor:'#eee'}}></View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width:width,
    height:height,
    position:'relative',
  },
  submit:{
    height:50,
    backgroundColor:'#7b7dea',
    justifyContent:'center',
    alignItems:'center',
  },
  submitText:{
    color:'#fff',
    fontSize:18,
    textAlign:'center',
    backgroundColor:'transparent',
    padding:0,
  },
  applyTitle:{
    fontSize:18,
    color:'#7b7dea',

  },
  tipsBlock:{
    marginTop:10,
    borderWidth:10,
    borderColor:'#f7f8fd',
    backgroundColor:'#f7f8fd',

  },
  tips:{
    fontSize:12,
    color:'#242424',
    lineHeight:18,
    backgroundColor:'transparent',
  },
  formBlock:{
    marginTop:15
  },
  title:{
    fontSize:16,
    color:'#242424',
  },
  title_tail:{
    color:'#888',
  },
  selectBlock:{
    borderWidth:1,
    borderColor:'#e9eaed',
    padding:10,
    marginTop:8,
  },
  selectText:{
    fontSize:12,
    color:'#888',
  },
  searchHeader:{
    height:64,
    backgroundColor:'#2c2d3f',
    width:width,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:15,
    paddingRight:15,
    position:'relative',
  },
  searchHeaderLeft:{
    flex:12,
    backgroundColor:'#4d4f6d',
    height:28,
    borderRadius:14,
    position:'relative',
    top:26,
  },
  searchHeaderInput:{
    borderWidth:0,
    backgroundColor:'transparent',
    fontSize:16,
    color:'#fff',
    position:'relative',
    height:28,
    left:10,
    width:"90%",
    padding:0,
  },
  searchHeaderIcon:{
    position:'absolute',
    right:10,
    top:5,
    backgroundColor:'transparent',
    fontSize:18,
  },
  searchHeaderCancel:{
    flex:2,
    position:'relative',
    top:31,
  },
  searchHeaderCancelText:{
    color:'#fff',
    backgroundColor:'transparent',
    fontSize:16,
    textAlign:'right',
  },
  searchContent:{

  },
  searchItem:{
    height:45,
    backgroundColor:'#fff',
    paddingLeft:15,
    paddingRight:15,
    borderBottomWidth:1,
    borderBottomColor:'#e9eaed',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  searchItemText:{
    backgroundColor:'transparent',
    fontSize:12,
    color:'#242424',
    flex:8,
  },
  searchItemTextInput:{
    backgroundColor:'transparent',
    height:45,
    lineHeight:45,
    fontSize:12,
    color:'#242424',
    flex:4,
    textAlign:'right',
  },
  dateTitle:{
    fontSize:16,
    color:'#242424',
    textAlign:'center',
    backgroundColor:'transparent',
  },
  dateTitleBlock:{
    borderBottomWidth:1,
    borderColor:'#e9eaed',
    paddingTop:10,
    paddingBottom:10,
    marginTop:10,
  },
  remarks:{
    fontSize:12,
    color:'#888',
    backgroundColor:'transparent',
    borderWidth:0,
    height:16,
    padding:0,
  },
  courseListBlock:{
    paddingLeft:15,
    paddingRight:15,
    height:45,
    borderBottomWidth:1,
    borderColor:'#e9eaed',
    justifyContent:'space-between',
    display:'flex',
    flexDirection:'row',

  },
  courseListLeft:{
    flex:1,
    height:45,
    backgroundColor:'transparent',
    position:'relative',
    justifyContent:'center',
  },
  courseListLeftText:{
    fontSize:16,
    color:'#242424',
    backgroundColor:'transparent',
  },
  courseListRight:{
    flex:1,
    height:45,
    backgroundColor:'transparent',
    justifyContent:'center',
  },
  courseListRightText:{
    fontSize:16,
    color:'#bbb',
    textAlign:'right',
    backgroundColor:'transparent',
  },
  courseListRightIcon:{
    position:'absolute',
    top:12,
    right:0,
    fontSize:24,
    color:'#7e80ea',
  },
  dateSelect:{
    height:50,
    justifyContent:'center',
  },
  dateSelectText:{
    textAlign:'center',
    color:'#7e80ea',
  },
});
