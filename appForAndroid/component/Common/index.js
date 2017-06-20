
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
  ScrollView,
  Modal,
  ListView,
  TextInput,
} from 'react-native';

import userRequest,{userApi} from '../../common/request';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';

//使用方式
// <CommonHeader title='我的审批' navigator={this.props.navigator}/>
export class CommonHeader extends Component {

  constructor(props){
    super(props);
    this.state = {

    };
  }
  static defaultProps = {
        backIcon: true,
    }

  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{this.props.title}</Text>
        {this.props.backIcon&&
          <TouchableHighlight style={styles.leftArrowBlock} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this.props.navigator.pop()}}>
            <Icon name='ios-arrow-back' style={styles.leftArrow}/>
          </TouchableHighlight>
        }

      </View>
    );
  }
}

// 使用方式 <CommonContentBlock>children</CommonContentBlock>
export class CommonContentBlock extends Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <ScrollView style={styles.content} scrollEventThrottle={200}>
        {this.props.children}
      </ScrollView>
    );
  }
}


//使用方式
// <CommonTabs TabItems={[{name:'待审批'},{name:'我的审批'}]} selectID={this.state.selectID} changeTab={(index)=>this._changeTab(index)} />
export class CommonTabs extends Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.TabItemBlock}>
        {
          this.props.TabItems.map((data,index)=>{
            var _style_item = {width:width/this.props.TabItems.length};
            var _style_default = {height:50,borderRightWidth:1,borderColor:'#eee'}
            var _style_default_act = {height:50,borderRightWidth:1,borderColor:'#eee',borderBottomWidth:2,borderBottomColor:'#7b7dea',}
            var _style = this.props.selectID == index?Object.assign(_style_item,_style_default_act):Object.assign(_style_item,_style_default);

              return (
                 <TouchableHighlight key={index} style={[_style,{justifyContent:'center',alignItems:'center',}]} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this.props.changeTab(index)}}>
                      <Text style={this.props.selectID == index?styles.TabItemTextAct:styles.TabItemText}>
                        {data.name}
                      </Text>
                  </TouchableHighlight>
              )


          })
        }
      </View>
    );
  }
}
export class ToolButtoms extends Component {
  constructor(props){
    super(props);
    this.state={

    };
  }
  render(){
    return (
      <View style={styles.toolButtomsBlock}>
        <TouchableHighlight style={styles.toolButtom} onPress={()=>this.props.allowAction()}>
          <View style={{backgroundColor:'#7b7dea',justifyContent:'center',alignItems:'center',height:50,}}>
            <Text style={styles.toolButtomText}>{this.props.allowText}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.toolButtom} onPress={()=>this.props.refuseAction()}>
          <View style={{backgroundColor:'#00c6ff',justifyContent:'center',alignItems:'center',height:50,}}>
            <Text style={styles.toolButtomText}>{this.props.refuseText}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
export class SingleBottomButton extends Component {
  constructor(props){
    super(props);
    this.state={

    };
  }
  render(){
    return (
      <TouchableHighlight style={styles.SingleBottomButton} activeOpacity={0.6} underlayColor={'#7b7dea'} onPress={()=> {this.props.btAction()}}>
        <Text style={styles.SingleBottomButtonText}>
          {this.props.title}
        </Text>
      </TouchableHighlight>
    )
  }
}
export class AlertPromt extends Component {
  constructor(props){
    super(props);
    this.state={
      val:''
    };
    this.styles= StyleSheet.create({
      modal:{
        width:width,
        height:height,
        position:'relative',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
      },
      modalBack:{
        position:'absolute',
        left:0,
        top:0,
        width:width,
        height:height,
        backgroundColor:'#000',
        opacity:0.5,
      },
      modalInnerBox:{
        width:280,
        backgroundColor:'#fff',
        borderRadius:3,
      },
      titleBox:{
        height:60,
        borderBottomColor:"#27B4E7",
        borderBottomWidth:2,
        paddingLeft:15,
        paddingRight:15,
        display:'flex',
        justifyContent:'center',

      },
      titleText:{
        fontSize:18,
        textAlign:'left',
        color:'#27B4E7',
        padding:0,
      },
      buttonBox:{
        height:40,
        borderTopColor:"#eee",
        borderTopWidth:1,
        paddingLeft:15,
        paddingRight:15,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
      },
      buttonText:{
        fontSize:18,
        textAlign:'left',
        color:'#27B4E7',
        padding:0,
      },
    })
  }
  handleClick(){
    this.props.buttonClick(this.state.val);
  }
  render(){
    return (
      <Modal
          animationType={"fade"}
          transparent={true}
          visible={true}
          style={this.styles.modal}
          onRequestClose={() => {}}
      >
      <View style={this.styles.modal}>

      <View style={this.styles.modalBack}></View>
      <View style={this.styles.modalInnerBox}>
        <View style={this.styles.titleBox}>
            <Text style={this.styles.titleText}>
              {this.props.title||'标题'}
            </Text>
        </View>
        <View>
            <TextInput
              underlineColorAndroid='transparent'
              autoFocus={true}
              onChangeText={(data)=>{this.setState({val:data})}}
            />
        </View>

        <TouchableHighlight style={this.styles.buttonBox} activeOpacity={0.9} underlayColor='#eee' onPress={()=>{this.handleClick()}}>
          <Text style={this.styles.buttonText}>
            {this.props.buttonText||'ok'}
          </Text>
        </TouchableHighlight>

        </View>
        </View>
      </Modal>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:width,
    height:height,
  },
  header: {
    width:width,
    height:44,
    backgroundColor:'#2c2d3f',
    position:'relative',
  },
  leftArrowBlock:{
    position:'absolute',
    left:0,
    top:10,
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
  title:{
    fontSize:18,
    textAlign:'center',
    backgroundColor:'transparent',
    color:'#fff',
    position:'relative',
    paddingTop:10
  },
  content:{
    borderWidth:15,
    borderColor:'#fff',
    backgroundColor:'#fff',
  },
  selectTitleBlock:{
    width:width,
    height:64,
    backgroundColor:'#2c2d3f',
    position:'relative',
  },
  selectTitleText:{
    fontSize:18,
    textAlign:'center',
    backgroundColor:'transparent',
    color:'#fff',
    position:'relative',
    paddingTop:30
  },
  TabItemBlock:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
    backgroundColor:'white',
  },
  TabItem:{
    height:50,
    borderRightWidth:1,
    borderColor:'#eee',
    justifyContent:'center',
    alignItems:'center',
  },
  TabItemAct:{
    height:50,
    borderRightWidth:1,
    borderColor:'#eee',
    borderBottomWidth:2,
    borderBottomColor:'#7b7dea',
    justifyContent:'center',
    alignItems:'center',
  },
  TabItemText:{
    fontSize:16,
    color:'#242424',
    backgroundColor:'transparent',
    textAlign:'center',
    padding:0,
  },
  TabItemTextAct:{
    fontSize:16,
    color:'#7b7dea',
    backgroundColor:'transparent',
    textAlign:'center',
    padding:0,
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
    textAlign:'center',
    backgroundColor:'transparent',
    padding:0,
  },
  SingleBottomButton:{
    height:50,
    backgroundColor:'#7b7dea',
    justifyContent:'center',
    alignItems:'center',
  },
  SingleBottomButtonText:{
    color:'#fff',
    fontSize:18,
    textAlign:'center',
    backgroundColor:'transparent',
  },
});
