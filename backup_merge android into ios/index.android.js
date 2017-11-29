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
let weather_response ='';

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
    if (Platform.OS=='android'){
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
    else {
      return (
        <View style={{ flex: 1 }}>

          <Image
            source={require('./background.png')}  
            style={{ 
              //backgroundColor: '#ccc',
              flex: 1,
              resizeMode:'stretch',
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
            }}
          >   
            <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
              <WithLabel label="所以..." >
                <TextInput
                  style={{
                    height: 40, 
                    marginBottom: 15, 
                    marginTop: 15, 
                    width:230,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                  onChangeText={this.set_name}
                  placeholder={this.state.holder}
                  // onEndEditing={()=>editable={false}}
                  //editable={false}
                  //onSubmitEditing={console.log(this.state.name)}
                />
              </WithLabel>
              <Text style={{
                color: '#228b22', 
                fontSize: 25, 
                marginBottom: 15, 
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0)',
              }}>
                  你的名字是{user_data}!?
              </Text>
            </View>

            <TouchableOpacity onPress={() => navigate('Botomo')} style={styles.button}>
              <Text style={styles.buttonText}>
                跟朋友聊天囉
              </Text>
            </TouchableOpacity>
          </Image>
        </View>
      );
    }
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
      userdataUpdate: false,
      userdataUpdate_on: true,
      cacheTimeS:'',
      cacheLocation:'',
      cacheAT:'',
      setlng:121.4316119,
      setlan:25.0353401,
    };
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
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
      (error) => console.log(JSON.stringify(error)),
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
  switch(property){
    case 1: weather_response = {
              response_CI: '今天天氣',
              response_CI2: '明天天氣',
              response_temp: '的氣溫是',
              response_temp2: '度喔',
              response_pop: '降雨機率是',
              response_pop2: '%喔',
              response_hot: '太陽有點大呢',
              response_cold: '要帶件外套保暖',
              response_fine: '兔兔想要出去玩',
              response_rain: '一直下雨..兔兔覺得難過',
              avatar: "https://rm-content.s3-accelerate.amazonaws.com/564a02c8e64b86a74eea9b2e/460941/upload-5b2745d0-6d93-11e7-9b68-d76d941e9686.png"
            };
            break;
    case 2:  weather_response = {
              response_CI: '今天天氣',
              response_CI2: '明天天氣',
              response_temp: '的溫度是',
              response_temp2: '度，真想睡覺阿',
              response_pop: '降雨機率是',
              response_pop2: '%，好想睡覺阿',
              response_hot: '挖，在家曬太陽真好睡阿',
              response_cold: '窩在被窩真好睡阿',
              response_fine: '(打哈欠)',
              response_rain: '下雨就在家睡覺吧',
              avatar: "http://a17kennels.co.uk/wp-content/uploads/2013/01/success_cat-294x300.png"
            };
            break;
    case 3: weather_response = {
              response_CI: '今天天氣',
              response_CI2: '明天天氣',
              response_temp: '是的主人，馬上幫你查詢。該區溫度是',
              response_temp2: '度',
              response_pop: '降雨機率為',
              response_pop2: '%',
              response_hot: '主人要記得避開太陽',
              response_cold: '主人，讓兔兔幫您穿外套',
              response_fine: '請問主人，兔兔可以陪您出門嗎?',
              response_rain: '主人，這把傘請您帶出門。',
              avatar:"http://i.osimg.com/vi/nTLIUBdJZ9.jpg"
            };
            break;
    case 4: weather_response = {
              response_CI: '今天天氣',
              response_CI2: '明天天氣',
              response_temp: '我..我才不會告訴你那裡',
              response_temp2: '度的',
              response_pop: '我也不會告訴你降雨機率是',
              response_pop2: '%的..哼',
              response_hot: '你如果曬傷了..我才不會關心你勒..',
              response_cold: '你不穿外套嗎?我..我這才不是在意你',
              response_fine: '你不能帶我出門嗎?我才不是想跟你出門，我只是想自己去吃蛋糕啦',
              response_rain: '如果你淋濕回來感冒，我不管你喔',
              avatar:"https://i.artfile.me/wallpaper/07-04-2017/360x225/anime-toaru-majutsu-no-index-devushka-vz-1149569.jpg"
            };
            break;
    case 5: weather_response = {
              response_CI: '今天天氣',
              response_CI2: '明天天氣',
              response_temp: '自己不會去查，還要我跟你說',
              response_temp2: '度',
              response_pop: '降雨機率是',
              response_pop2: '%，87阿',
              response_hot: '如果曬傷了要你好看',
              response_cold: '如果感冒了，你就不用回來了',
              response_fine: '跪下道歉阿',
              response_rain: '淋濕你就完蛋了',
              avatar:"http://livedoor.blogimg.jp/subroku18/imgs/5/d/5d4883bd.png"
            };
            break;
  }   
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: weather_response.avatar,
          },         
        }),
      };
    });
  }
/*旁邊的加號*/
  renderCustomActions(props) {
    const options = {
     '切換邊緣開發者的發言': (props) => {
        this.state.userdataUpdate_on=!this.state.userdataUpdate_on;
      },
      '隨機屬性切換': (props) => {
        property=Math.floor((Math.random() * 5) + 1);
      },
      '返回': () => {},
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
    var deviceID=this.getUniqueID();
    /* userdataUpdate */
    if (this.state.userdataUpdate&&this.state.userdataUpdate_on){
      fetch("http://botomo.kyotw.me:20201/userdata/apps/", {
        method: "POST",
        body: JSON.stringify({
            id:deviceID,
            SearchTime:this.state.cacheTimeS,
            SearchLoc:this.state.cacheLocation,
            SearchTemp:this.state.cacheAT,
            Msg:message
        })
      })
      .then((res) => res.text())
      .then((responseData) => {
        this.onReceive(responseData);
        this.onReceive("邊緣的開發者收到回應");
        // clean state
        this.setState((previousState) => {
            return {
             typingText: null,
              user: {
                _id: 2,
                name: 'React Native',
                avatar: weather_response.avatar,
              }, 
            };
        });
        // next message redirect to weather
        this.state.userdataUpdate=false;
      })
      .done();
    }
    /* toLUIS */
    else {
      var gpscut = JSON.parse(this.state.lastPosition);
      if(gpscut.coords.longitude!=null) this.state.setlng=gpscut.coords.longitude;
      if(gpscut.coords.latitude!=null) this.state.setlan=gpscut.coords.latitude;
      fetch("http://botomo.kyotw.me:20201/bot_response/", {
        method: "POST",
        body: JSON.stringify({
          id: message,
          lng: this.state.setlng,
          lat: this.state.setlan,
          device: deviceID
          //createdAt: new Date(),
        })
      })
      .then((res) => res.text())
      .then((responseData) => {
        // 接到 Data
        var cut = JSON.parse(responseData);
        var place;
        if(cut.landmark!=null) place=cut.landmark;
        else place=cut.location;
        this.onReceive(responseData);
        if (cut.intent!="Weather") this.onReceive(cut.response);
        else{
          if(cut.T!=null){
            if(property<=2) this.onReceive(place+weather_response.response_temp+cut.T+weather_response.response_temp2);
            else this.onReceive(weather_response.response_temp+cut.T+weather_response.response_temp2);
          }
          if(cut.POP!=null){
            this.onReceive(weather_response.response_pop+cut.POP+weather_response.response_pop2);
            if(cut.POP>=70) this.onReceive(weather_response.response_rain);
          }
          if(cut.AT!=null){
            temp=parseInt(cut.AT);
            if(temp>=28) this.onReceive(weather_response.response_hot);
            else if(temp<=21) this.onReceive(weather_response.response_cold);
            else this.onReceive(weather_response.response_fine);
          }
          if(this.state.userdataUpdate_on&&cut.Now==1)
            this.onReceive("邊緣的開發者發言中...這樣的天氣很熱?很冷?還是很舒適?若不想回答，請按左下角的加號切換");
          this.state.cacheTimeS=cut.TimeS;
          this.state.cacheLocation=cut.location;
          this.state.cacheAT=cut.AT;
          if(cut.Now==1)this.state.userdataUpdate=true;
        }
        this.setState((previousState) => {
            return {
             typingText: null,
            };
        });
      })
      .done();
    }
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