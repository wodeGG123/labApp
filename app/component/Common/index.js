
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
                 <TouchableHighlight key={index} style={_style} activeOpacity={0.6} underlayColor={'transparent'} onPress={()=> {this.props.changeTab(index)}}>
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
const styles = StyleSheet.create({
  container:{
    width:width,
    height:height,
  },
  header: {
    width:width,
    height:64,
    backgroundColor:'#2c2d3f',
    position:'relative',
  },
  leftArrowBlock:{
    position:'absolute',
    left:0,
    top:28,
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
    paddingTop:30
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
    borderColor:'#eee'
  },
  TabItemAct:{
    height:50,
    borderRightWidth:1,
    borderColor:'#eee',
    borderBottomWidth:2,
    borderBottomColor:'#7b7dea',
  },
  TabItemText:{
    fontSize:16,
    color:'#242424',
    lineHeight:50,
    backgroundColor:'transparent',
    textAlign:'center',
  },
  TabItemTextAct:{
    fontSize:16,
    color:'#7b7dea',
    lineHeight:50,
    backgroundColor:'transparent',
    textAlign:'center',
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
  SingleBottomButton:{
    height:50,
    backgroundColor:'#7b7dea',
  },
  SingleBottomButtonText:{
    color:'#fff',
    fontSize:18,
    textAlign:'center',
    backgroundColor:'transparent',
    lineHeight:50,
  },
});
