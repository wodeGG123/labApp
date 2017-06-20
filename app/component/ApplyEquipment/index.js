
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
  DatePickerIOS,
  ListView,
  TextInput,
  ScrollView,
  AlertIOS,
} from 'react-native';


import userRequest,{userApi} from '../../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import dateFormat from 'dateformat';
const {height, width} = Dimensions.get('window');


//引用模块组件
import {CommonHeader,CommonContentBlock,SingleBottomButton} from '../Common/index';
export default class ApplyEquipment extends Component {
  constructor(props){
    super(props);
    this.state = {
        userInfo:this.props.userInfo,//用户信息
        tips:'可预约明日至2017年03月30日的可用设备，每次最多可借用5天，借用规则为上午、下午、晚上、全天。',
        modalVisible: false,
        modalTeacher: false,
        teacher:false,
        equipments:[],
        modalDate:false,
        date: new Date((+new Date())+1000*24*60*60),
        dateStart: new Date((+new Date())+1000*24*60*60),
        dateEnd: new Date((+new Date())+1000*24*60*60),
        dateFormatText:false,
        remarks:'',
        timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
  }
  componentWillMount(){
    if(this.state.userInfo.type == 2){
      this.setState({
          teacher:this.state.userInfo.id,
      })
    }

    let tipsDate = new Date((+new Date())+1000*24*60*60*this.state.userInfo.settings.BorrowDayEquipment);
    tipsDate = dateFormat(tipsDate,'yyyy年mm月dd日');
    const tips = '可预约明日至'+ tipsDate +'的可用设备，每次最多可借用'+ this.state.userInfo.settings.MaxBorrowDayEquipment +'天。';
    this.setState({
        tips:tips
    })
  }
  componentDidUpdate(){
  }
  _setModalVisible() {
    if(!this.state.dateFormatText){
      AlertIOS.alert(
         '请先选择日期！',
        );
      return;
    }
    this.setState({modalVisible: true});

  }
  _setModalHidden(data,eq) {
    const equipments = [];
    eq.map((obj,index)=>{
        if(obj.selectNum.trim() != ''){
            equipments.push(obj)
        }
    })
    this.setState({
      modalVisible: false,
      equipments:equipments
    });
  }
  _setModalTeacher(modal,teacher) {
    this.setState({
      modalTeacher: modal,
      teacher:teacher,
    });
  }
  _selectDate(modalDate){
    this.setState({
      modalDate:modalDate,
    });
    if(!modalDate){
      let dateFormatText = dateFormat(this.state.dateStart,'yyyy年mm月dd日');
      dateFormatText += ' -> ';
      dateFormatText += dateFormat(this.state.dateEnd,'yyyy年mm月dd日');
      this.setState({
        dateFormatText:dateFormatText,
      });
    }
  }
  onDateStartChange(date){
    this.setState({
      dateStart:date,
    })
  }
  onDateEndChange(date){
    this.setState({
      dateEnd:date,
    })
  }
  _submit(){
    if(+this.state.dateEnd < +this.state.dateStart){
      AlertIOS.alert('截止日期错误！');
      return ;
    }
    if(!this.state.dateFormatText || !this.state.equipments[0] || !this.state.teacher){
        AlertIOS.alert('请完善信息后提交！');
        return ;
    }


    const equpments = this.state.equipments.map((obj,index)=>(obj.id));
    const date = this.state.dateFormatText.split('->');
    date[0] = date[0].replace('年','-').replace('月','-').replace('日','');
    date[1] = date[1].replace('年','-').replace('月','-').replace('日','');
    const num = this.state.equipments.map((obj,index)=>(obj.selectNum));
    const toolid = this.state.equipments.map((obj,index)=>(obj.id));
    userRequest.post(userApi.applyEquipment,{
      borrowequipments:equpments,
      EquipmentBorrow:{
          reason:this.state.remarks,
          borrow_start:date[0].trim(),
          borrow_end:date[1].trim(),
          teacher_id:this.state.teacher.id,
        },
      num:{
        toolid:toolid,
        num:num,
      },
    })
    .then((data)=>{
      if(data.code == '0000'){
        AlertIOS.alert('申请成功！',null,()=>{
            this.props.navigator.pop();
        });

      }else{
        AlertIOS.alert(data.data.berror[0],null,()=>{

        });
      }
});
  }
  render() {
    return (
      <View style={styles.container}>
        <CommonHeader title='设备申请' navigator={this.props.navigator}/>
        <CommonContentBlock>
          <Text style={styles.applyTitle}>
            设备借用申请
          </Text>
          <View style={styles.tipsBlock}>
            <Text style={styles.tips}>
              {this.state.tips}
            </Text>
          </View>
          {/* 选择日期 */}
          <View style={styles.formBlock}>
            <Text style={styles.title}>
              日期选择
            </Text>
            <TouchableHighlight style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._selectDate(true)}}>
              <Text style={styles.selectText}>
                {this.state.dateFormatText||'请选择日期--'}
              </Text>
            </TouchableHighlight>

          </View>
          {/* 选择日期 */}
          {/* 选择设备 */}

          <View style={styles.formBlock}>
            <Text style={styles.title}>
              设备选择<Text  style={styles.title_tail}>（可多选）</Text>
            </Text>
            <TouchableHighlight style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._setModalVisible()}}>
              <Text style={styles.selectText}>
                {this.state.equipments[0]?this.state.equipments.map((obj)=>{return obj.name + '('+ obj.selectNum +')'+'、'}):'请选择--'}
              </Text>
            </TouchableHighlight>
          </View>
            {/* 选择设备 */}
            {/* 选择指导老师 */}
            {this.state.userInfo.type == 2?null:<View style={styles.formBlock}>
              <Text style={styles.title}>
                选择指导老师
              </Text>
              <TouchableHighlight style={styles.selectBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._setModalTeacher(true)}}>
                <Text style={styles.selectText}>
                  {this.state.teacher?this.state.teacher.username:'请选择--'}
                </Text>
              </TouchableHighlight>
            </View>}

          {/* 选择指导老师 */}
          {/* 备注 */}
        <View style={styles.formBlock}>
          <Text style={styles.title}>
            备注
          </Text>
          <View style={styles.selectBlock}>

            <TextInput
            style={styles.remarks}
            onChangeText={(remarks) => this.setState({remarks})}
            value={this.state.remarks}
            placeholder={'请输入备注'}
            />

          </View>
        </View>
        {/* 备注 */}
        </CommonContentBlock>
        <TouchableHighlight style={styles.submit} activeOpacity={0.6} underlayColor={'#7b7dea'} onPress={()=> {this._submit()}}>
          <Text style={styles.submitText}>
            提交申请
          </Text>
        </TouchableHighlight>


        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >

          <CommonSelect selectEq={this.state.equipments} dateTime={this.state.dateFormatText} setModalVisible={(data)=>this._setModalHidden(data)} btTitle='确认' btAction={(data)=>{this._setModalHidden(false,data)}} dataUrl={userApi.equipmentList} title='选择设备' />

        </Modal>

        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalDate}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <CommonHeader title='选择日期' backIcon={false} navigator={this.props.navigator}/>
          <ScrollView>
          <View style={{backgroundColor:'white'}}>
              <View style={styles.dateTitleBlock}>
              <Text style={styles.dateTitle}>起始时间</Text>
              </View>
              <DatePickerIOS
                date={this.state.dateStart}
                minimumDate={this.state.date}
                maximumDate={new Date((+this.state.date)+1000*24*60*60*parseInt(29))}
                mode="date"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={(date)=>{this.onDateStartChange(date)}}
                minuteInterval={10}
              />
          </View>
          <View style={{backgroundColor:'white'}}>
              <View style={styles.dateTitleBlock}>
                <Text style={styles.dateTitle}>结束时间</Text>
              </View>
              <DatePickerIOS
                date={this.state.dateEnd}
                minimumDate={this.state.date}
                maximumDate={new Date((+this.state.date)+1000*24*60*60*parseInt(29))}
                mode="date"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={(date)=>{this.onDateEndChange(date)}}
                minuteInterval={10}
              />
          </View>
          </ScrollView>
          <SingleBottomButton title='确认' btAction={()=>{this._selectDate(false)}}/>
        </Modal>

        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalTeacher}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >

          <OneSelect selectTeacher={this.state.teacher} setModalTeacher={(modal,teacher)=>{this._setModalTeacher(modal,teacher)}} selectAction={(modal,data)=>{this._setModalTeacher(modal,data)}} dataUrl={userApi.teacherList} title='选择指导老师'/>
        </Modal>
      </View>
    );
  }
}
//选择设备select组件
class CommonSelect extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
       dataSource: ds.cloneWithRows([]),
       dataList:this.props.selectEq,
       selectSource:ds.cloneWithRows([]),
       searchText:'',
       selecting:'flex',
    };
  }
  componentWillMount(){
    const _date = this.props.dateTime.split('->');
    _date[0] = _date[0].replace('年','-').replace('月','-').replace('日','');
    _date[1] = _date[1].replace('年','-').replace('月','-').replace('日','');
    if(!this.state.dataList[0]){
      userRequest.get(this.props.dataUrl,{"name":"","date":_date[0].trim()+","+_date[1].trim()})
      .then((data)=>{
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(data.data),
        })
      });
    }else{
      this.setState({
        selecting:'none',
      })
    }

    this.setState({
      selectSource:this.state.selectSource.cloneWithRows(this.state.dataList),
    })
  }
  _selectItem(data){
    let dataList = this.state.dataList;
    let _push = true;
    dataList.map((obj,index)=>{
      if(data.id==obj.id){
          _push=false;
      }
    }
    )
    if(_push){
      data.selectNum = '1';
      dataList.push(data);
    }

    this.setState({
      dataList:dataList,
      selectSource:this.state.selectSource.cloneWithRows(dataList),
      selecting:'none',
    })

  }
  _search(text){
    const _text = text.replace(/\s/g,',');
    const _date = this.props.dateTime.split('->');
    _date[0] = _date[0].replace('年','-').replace('月','-').replace('日','');
    _date[1] = _date[1].replace('年','-').replace('月','-').replace('日','');
    userRequest.get(this.props.dataUrl,{name:_text,username:_text,"date":_date[0].trim()+","+_date[1].trim()})
    .then((data)=>{
      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(data.data),
      })
    });
    this.setState({
      searchText:text,
      selecting:'flex',
    });
  }
  _searchCancel(){
    this.setState({
      searchText:'',
      selecting:'none',
    })
  }
  _setSelectNum(num,id){


    let dataList = _.cloneDeep(this.state.dataList);
    if(num.trim() == ''){
      dataList[id].selectNum = num;
    }else{
      if(isNaN(parseInt(num))){
        return ;
      }else{

        dataList[id].selectNum = dataList[id].num < parseInt(num)? dataList[id].num.toString():parseInt(num).toString();

      }
    }


    this.setState({
      dataList:dataList,
      selectSource:this.state.selectSource.cloneWithRows(dataList),
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
              style={styles.searchContent}
              scrollEventThrottle={200}
              dataSource={this.state.selectSource}
              renderRow={(rowData,sectionId,rowId) => (
                <View style={styles.searchItem}>
                    <Text style={styles.searchItemText}>{rowData.name}【{rowData.modelname}】<Text style={{color:'#ff6e00'}}>（剩余{rowData.num}）</Text></Text>
                    <TextInput
                      style={styles.searchItemTextInput}
                      onChangeText={(text) => {this._setSelectNum(text,rowId)}}
                      value={this.state.dataList[rowId].selectNum||null}
                      placeholder='借用数量'
                      keyboardType='numeric'
                    />
                </View>

              )}
            />
                <ListView
                  enableEmptySections={true}
                  style={{width:width,height:height-64,backgroundColor:'#fff',position:'absolute',top:64,zIndex:1,display:this.state.selecting}}
                  scrollEventThrottle={200}
                  dataSource={this.state.dataSource}
                  renderRow={(rowData) => (
                    <TouchableHighlight style={styles.searchItem} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this._selectItem(rowData)}}>
                        <Text style={styles.searchItemText}>{rowData.name}【{rowData.modelname}】<Text style={{color:'#ff6e00'}}>（剩余{rowData.num}）</Text></Text>
                    </TouchableHighlight>

                  )}
                />



        <SingleBottomButton title={this.props.btTitle} btAction={()=>{this.props.btAction(this.state.dataList)}}/>





        </View>
    );
  }
}

//选择老师select组件
class OneSelect extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
       dataSource: ds.cloneWithRows([]),
       selected:this.props.selectTeacher
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
    this.props.selectAction(false,data);
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
                    <Text style={styles.searchItemText}>{rowData.username}</Text>
                </TouchableHighlight>
              )}
            />
            <SingleBottomButton title='关闭' btAction={()=>{this.props.setModalTeacher(false,'')}} />
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
  },
  submitText:{
    color:'#fff',
    fontSize:18,
    textAlign:'center',
    backgroundColor:'transparent',
    lineHeight:50,
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
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
  },
  searchItemText:{
    backgroundColor:'transparent',
    height:45,
    lineHeight:45,
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
  }
});
