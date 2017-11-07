let greeting = {
  normal_greeting: '今天來點兔子嗎',
  sadism_greeting: '你現在是有什麼問題啦',
  maid_greeting: '請問主人有什麼吩咐',
  tsundere_greeting: '我..我..才不是在關心你勒',
  buddy_greeting: '嘿，今天過得怎樣啊',
};
state = {
    greeting_text: "",
};
var random=Math.floor((Math.random() * 5) + 1);
switch(random){
  case 1: this.state.greeting_text=greeting.normal_greeting;
          break;
  case 2: this.state.greeting_text=greeting.sadism_greeting;
          break;
  case 3: this.state.greeting_text=greeting.maid_greeting;
          break;
  case 4: this.state.greeting_text=greeting.tsundere_greeting;
          break;
  case 5: this.state.greeting_text=greeting.buddy_greeting;
          break;
}
module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    text: '對..對不起..',
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
