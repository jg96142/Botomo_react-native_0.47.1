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
  TextInput
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
//import SQLite from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import {StackNavigator} from 'react-navigation';
var RNDeviceInfo = require('react-native').NativeModules.RNDeviceInfo;
var PushNotification = require('react-native-push-notification');
/*使用者名字和回覆用語*/
var user_data = '';
let weather_response = {
 normal_greeting: '',
 sadism_greeting: '',
 maid_greeting: '',
 tsundere_greeting: '',
 buddy_greeting: '',
};
/*推播*/
PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log( 'TOKEN:', token );
    },
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    },
    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM SENDER ID",
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});
PushNotification.localNotification({
    /* Android Only Properties */
    id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    ticker: "My Notification Ticker", // (optional)
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: "我在試試看", // (optional) default: "message" prop
    subText: "試試看", // (optional) default: none
    color: "red", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'some_tag', // (optional) add tag to message
    group: "group", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification
//     iOS and Android properties 
    title: "標題", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
    message: "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", // (required)
    //playSound: false, // (optional) default: true
    //soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //repeatType: 'day', // (Android only) Repeating interval. Could be one of `week`, `day`, `hour`, `minute, `time`. If specified as time, it should be accompanied by one more parameter 'repeatTime` which should the number of milliseconds between each interval
    actions: '["知道囉"]',  // (Android only) See the doc for notification actions to know more
});

/*主畫面*/
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      holder: '你的名字?',
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
    // if user_data==
    const { navigate } = this.props.navigation;
    return (
      user_data=this.state.name,
      <View>
      <TextInput
        style={{height: 40, borderColor: '#87cefa', borderWidth: 1, marginBottom: 10}}
        onChangeText={this.set_name}
        placeholder={this.state.holder}
        //onEndEditing={console.log(this.state.name)}
        //onSubmitEditing={console.log(this.state.name)}
      />
      <Text>
          {user_data}
      </Text>
      <Button
        onPress={() => navigate('Botomo')}
        title="跟朋友聊天囉"
        color="#ffa07a"
      />
      <Button
        onPress={() => Alert.alert(user_data)}
        title="test"
        color="black"
      />
      </View>
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
      initialPosition: 'unknown',
      lastPosition: 'unknown',
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
        messages: require('./data/messages.js'),
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
            avatar: 'http://www.freeiconspng.com/uploads/brown-white-cat-png-4.png',
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
      
      this.onReceive(responseData);
      this.onReceive("Request = "+cut.request);
      this.onReceive("Intent = "+cut.intent);
      this.onReceive("Location = "+cut.location);
      this.onReceive("WindDir = "+cut.WindDir);
      this.onReceive("Temp = "+cut.Temp);
      this.onReceive("--DeviceInfo--");
      this.onReceive("GeoLocation = "+this.state.lastPosition);
      this.onReceive("longitude = "+gpscut.coords.longitude);
      this.onReceive("latitude = "+gpscut.coords.latitude);
      this.onReceive("UniqueID = "+this.getUniqueID());
      this.onReceive("你覺得這樣的天氣很熱?很冷?還是很舒適?");
      //this.onReceive(responseData);
      
      
      this.setState((previousState) => {
          return {
           typingText: null,
          };
      });
    })
    .done();
  }
/*推播出來*/
  onNotification(id: '0'){};
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