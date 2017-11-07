let botomo_greeting = {
  normal: '今天來點兔子嗎',
  sadism: '你現在是有什麼問題啦',
  maid: '請問主人有什麼吩咐',
  tsundere: '我..我..才不是在關心你勒',
  buddy: '嘿，今天過得怎樣啊',
};
let user_greeting = {
  normal: '我要貓咪',
  sadism: '對..對....對不起....',
  maid: '躺下',
  tsundere: '(>///<',
  buddy: '還不錯啊，你勒',
}
state = {
    greeting_text: "",
    user_response: "",
};
var random=Math.floor((Math.random() * 5) + 1);
switch(random){
  case 1: this.state.greeting_text=botomo_greeting.normal;
          this.state.user_response=user_greeting.normal;
          break;
  case 2: this.state.greeting_text=botomo_greeting.sadism;
          this.state.user_response=user_greeting.sadism;
          break;
  case 3: this.state.greeting_text=botomo_greeting.maid;
          this.state.user_response=user_greeting.maid;
          break;
  case 4: this.state.greeting_text=botomo_greeting.tsundere;
          this.state.user_response=user_greeting.tsundere;
          break;
  case 5: this.state.greeting_text=botomo_greeting.buddy;
          this.state.user_response=user_greeting.buddy;
          break;
}
module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    text: this.state.user_response,
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'Developer',
    },
    // sent: true,
    // received: true,
    // location: {
    //   latitude: 48.864601,
    //   longitude: 2.398704
    // },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    text: this.state.greeting_text,
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'http://www.freeiconspng.com/uploads/brown-white-cat-png-4.png',
    },
  },
];
