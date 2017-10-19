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
  PermissionsAndroid
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
var RNDeviceInfo = require('react-native').NativeModules.RNDeviceInfo;

export default class Botomo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      //loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    //this.onLoadEarlier = this.onLoadEarlier.bind(this);
    //this.Buttonnn = this.Buttonnn.bind(this);
    this._isAlright = null;
  }
  getUniqueID() {
    return RNDeviceInfo.uniqueId;
  }
  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };

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

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
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
  getEvent(message) {
    var gpscut = JSON.parse(this.state.lastPosition);
    fetch("http://botomo.kyotw.me:20201/bot_response/", {
      method: "POST",
      body: JSON.stringify({
        id: message,
        longitude: gpscut.coords.longitude,
        latitude: gpscut.coords.latitude
        //createdAt: new Date(),
      })
    })

    .then((res) => res.text())
    .then((responseData) => {
      // 接到 Data
      // Alert.alert(
      //       '你覺得這樣的天氣如何',
      //       null,
      //       [
      //         {text: '太熱了', onPress: () => console.log('Too Hot Pressed!')},
      //         {text: '滿舒服的', onPress: () => console.log('Comfortable Pressed!')},
      //         {text: '太冷了', onPress: () => console.log('Too Cold Pressed!')},
      //       ]
      // );
      var cut = JSON.parse(responseData);
      
      // this.onReceive(responseData);
      this.onReceive("Request = "+cut.request);
      this.onReceive("Intent = "+cut.intent);
      this.onReceive("Location = "+cut.location);
      this.onReceive("--DeviceInfo--");
      this.onReceive("GeoLocation = "+this.state.lastPosition);
      this.onReceive("longitude = "+gpscut.coords.longitude);
      this.onReceive("latitude = "+gpscut.coords.latitude);
      this.onReceive("UniqueID = "+this.getUniqueID());
      this.onReceive("你覺得這樣的天氣很熱?很冷?還是很舒適?")
      /*this.onReceive(this.getModel()); by kyo*/
      //this.populateDatabase();

      this.setState((previousState) => {
          return {
           typingText: null,
          };
      });
      //alert(this.state.text)
      //this.state.text=.results[0].name;
    })/*
    .catch((error) => {
      //console.log(error);
      alert('error');
    })*/
    .done();
  }


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

AppRegistry.registerComponent('Botomo', () => Botomo);