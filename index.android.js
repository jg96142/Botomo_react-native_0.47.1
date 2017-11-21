import React from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  AsyncStorage,
  PermissionsAndroid,
  TextInput,
} from 'react-native';
import {
  GiftedChat,
  Actions,
  Bubble,
  MessageText,
  Message
} from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import {StackNavigator} from 'react-navigation';
var RNDeviceInfo = require('react-native').NativeModules.RNDeviceInfo;
var avatar=require('./data/messages.js').avatar;
var property=require('./data/messages.js').property;
/*使用者名字和回覆用語*/
var user_data = '';
let weather_response = {
  normal_response1: '的氣溫是',
  normal_response2: '度喔'
  //sadism_response: '',
  // maid_response: '',
  // tsundere_response: '',
  // buddy_response: '',
};

class WithLabel extends React.Component {
  render() {
    return (
      <View style={styles.labelContainer}>
        <View style={styles.label}>
          <Text>{this.props.label}</Text>
        </View>
        {this.props.children}
      </View>
    );
  }
}
/*主畫面*/
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'holder': '你的名字?',
      'name': '',
    };
  }
  static navigationOptions = {
    title: 'BOTOMO是你唯一的朋友',
  };
/*名字在資料庫*/
  componentDidMount = () =>AsyncStorage.getItem('name').then((value) =>this.setState({ 'name': value }))
  set_name = (value) =>{
    AsyncStorage.setItem('name', value);
    this.setState({ 'name': value });
  }
  render() { 
    user_data=this.state.name;
    const { navigate } = this.props.navigation;
    return (
      <Image source={require('./background.png')} style={{width:null, height:null, flex:1}}>
        <Text style={{flex:1}}></Text>
        <WithLabel label="所以...">
          <TextInput
            style={{height: 40, marginBottom: 15, marginTop: 15, width:230}}
            onChangeText={this.set_name}
            placeholder={this.state.holder}
            // onEndEditing={()=>editable={false}}
            //editable={false}
            //onSubmitEditing={console.log(this.state.name)}
          />
        </WithLabel>
        <Text style={{color: '#228b22', fontSize: 25, marginBottom: 15, textAlign: 'center'}}>
            你的名字是{user_data}!?
        </Text>

        <TouchableOpacity onPress={() => navigate('Botomo')} style={styles.button}>
          <Text style={styles.buttonText}>
            跟朋友聊天囉
          </Text>
        </TouchableOpacity>
      </Image>
    );
  }
}
/*聊天頁面*/
class Botomo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      //loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      initialPosition: '',
      lastPosition: '',
      response:'',
    };
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    //this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this._isAlright = null;
  }
/*拿手機ID*/
  getUniqueID() {
    return RNDeviceInfo.uniqueId;
  }
/*目前所在位置*/
  // state = {
  //   initialPosition: 'unknown',
  //   lastPosition: 'unknown',
  // };
  watchID: ?number = null;
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillMount() {
    navigator.geolocation.clearWatch(this.watchID);
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: require('./data/messages.js').initial_message,
      };
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  // onLoadEarlier() {
  //   this.setState((previousState) => {
  //     return {
  //       isLoadingEarlier: true,
  //     };
  //   });
  // }
/*查詢送入後端*/
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    // for demo purpose
    this.answerBotomo(messages[0].text)
    // this.answerDemo(messages);
  }
/*正在輸入*/
  answerBotomo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'Botomo is typing'
          };
        });
      }
    }
    setTimeout(() => {
      this.getEvent(messages)
    }, 1000);
  }
/*收到的回覆*/
  onReceive(text) {   
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: avatar,
          },         
        }),
      };
    });
  }
/*旁邊的加號*/
  renderCustomActions(props) {
    const options = {
      'Action 1': (props) => {
        alert(user_data);
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }
/*嘗試中的按鈕*/
  // button(){
  //   render(){
  //     return (
  //       <View>
  //         <Button
  //           onPress={()=> console.log("press")}
  //           title="Press Me"
  //         />
  //     </View>
  //     );
  //   }
  // }
/*要回傳的東西*/
  getEvent(message) {
    var gpscut = JSON.parse(this.state.lastPosition);
    fetch("http://botomo.kyotw.me:20201/bot_response/", {
      method: "POST",
      body: JSON.stringify({
        id: message,
        lng: gpscut.coords.longitude,
        lat: gpscut.coords.latitude
        //createdAt: new Date(),
      })
    })
    // fetch("http://botomo.kyotw.me:20201/userdata/apps/", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       id: message
    //       //createdAt: new Date(),
    //     })
    //   })
    .then((res) => res.text())
    .then((responseData) => {
      // 接到 Data
      // Alert.alert(user_data);
      // Alert.alert(
      //       '你覺得這樣的天氣如何',
      //       null,
      //       [
      //         {text: '太熱了', onPress: () => console.log('Too Hot Pressed!')},
      //         {text: '滿舒服的', onPress: () => console.log('Comfortable Pressed!')},
      //         {text: '太冷了', onPress: () => console.log('Too Cold Pressed!')},
      //       ]
      //);
      var cut = JSON.parse(responseData);
      
      // this.onReceive(responseData);
      // this.onReceive("Request = "+cut.request);
      // this.onReceive("Intent = "+cut.intent);
      // this.onReceive("Location = "+cut.location);
      // this.onReceive("WindDir = "+cut.WindDir);
      // this.onReceive("Temp = "+cut.T);
      // this.onReceive("--DeviceInfo--");
      // this.onReceive("GeoLocation = "+this.state.lastPosition);
      // this.onReceive("longitude = "+gpscut.coords.longitude);
      // this.onReceive("latitude = "+gpscut.coords.latitude);
      // this.onReceive("UniqueID = "+this.getUniqueID());
      //this.onReceive("你覺得這樣的天氣很熱?很冷?還是很舒適?");
      if(cut.T!=null){
        this.onReceive(cut.location+weather_response.normal_response1+cut.T+weather_response.normal_response2);
      }
      
      
      this.setState((previousState) => {
          return {
           typingText: null,
          };
      });
    })
    .done();
  }
/*染色的東西*/
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff8dc',            
          },
          right: {
            backgroundColor: '#48d1cc',          
          }
        }}
        // textStyle={{
        //   left: {
        //     color: 'white',
        //   }
        // }}
      />
    );
  }
  renderMessageText(props) {
    return (
      <MessageText
        {...props}
          textStyle={{
            left: {
              color: 'black',
            }
          }}
          containerStyle={{          
              color: 'black'           
          }}
      />
    );
  }
  renderMessage(props) {
    return (
      <Message
        {...props}
      />
    );
  }
  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }
  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }
/*其他東西*/
  render() {
    return (
       <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
       // loadEarlier={this.state.loadEarlier}
        //onLoadEarlier={this.onLoadEarlier}
        //isLoadingEarlier={this.state.isLoadingEarlier}
        onPressActionButton={this.onPressActionButton}
        user={{
          _id: 1, // sent messages should have same user._id
        }}       
        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
        renderMessageText={this.renderMessageText}
      />
    );
  }

}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#00bfff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 20,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#228b22',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelContainer: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  label: {
    width: 90,
    alignItems: 'flex-end',
    marginRight: 7,
    paddingTop: 27,
  },
});

const page = StackNavigator({
  Home: { screen: Home},
  Botomo: { 
    screen: Botomo,
    path: './index.android',
  },
});
export default page;
AppRegistry.registerComponent('Botomo', () => page);