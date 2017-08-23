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
//import utf8 from 'utf8';
//var utf8 = require('utf8');
//var React = require('react-native');
//var SQLite = require('react-native-sqlite-storage');
// SQLite.openDatabase({name : "Botomo", createFromLocation : 1}, successcb, errorcb);
//SQLite.openDatabase({name : "Botomo.db", createFromLocation : 1}," okCallback","errorCallback");
//SQLite.openDatabase("Botomo.db", "1.0", "userdata", -1);
export default class Botomo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
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
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this.Buttonnn = this.Buttonnn.bind(this);
    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: require('./data/messages.js'),
      };
    });
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });
  }

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
            typingText: 'Botring is typing'
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
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
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
  Buttonnn(){
    return(
        <View>
      <TouchableOpacity style={styles.button} onPress={this._onPressButton}>
          <Text style={styles.buttonText}> hhhh </Text>
      </TouchableOpacity>
        </View>
    )
  }
  getEvent(message) {
    fetch("http://botomo.kyotw.me:20201/bot_response/", {
      method: "POST",
      body: JSON.stringify({
        id: message
        //createdAt: new Date(),
      })
    })

    .then((res) => res.text())
    .then((responseData) => {
      // 接到 Data
      Alert.alert(
            '你覺得這樣的天氣如何',
            null,
            [
              {text: '太熱了', onPress: () => console.log('Foo Pressed!')},
              {text: '滿舒服的', onPress: () => console.log('Bar Pressed!')},
              {text: '太冷了', onPress: () => console.log('Baz Pressed!')},
            ]
      );
      var cut = JSON.parse(responseData);
      this.onReceive(responseData);
      this.onReceive(cut.intent);
      this.onReceive(cut.cut);
      this.onReceive(cut.request);
      this.onReceive((text)=>{

       
      });
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
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
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
    color: 'red',
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
    backgroundColor: '#406E9F',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

AppRegistry.registerComponent('Botomo', () => Botomo);