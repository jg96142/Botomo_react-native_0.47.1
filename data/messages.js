let botomo_greeting = {
  normal: '今天來點兔子嗎',
  sadism: '不要用你那骯髒的手碰我',
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
    botomo_avatar: "",
};
var random=Math.floor((Math.random() * 5) + 1);
switch(random){
  
  case 1: this.state.greeting_text=botomo_greeting.normal;
          this.state.user_response=user_greeting.normal;
          this.state.botomo_avatar="https://rm-content.s3-accelerate.amazonaws.com/564a02c8e64b86a74eea9b2e/460941/upload-5b2745d0-6d93-11e7-9b68-d76d941e9686.png"
          break;
  case 2: this.state.greeting_text=botomo_greeting.sadism;
          this.state.user_response=user_greeting.sadism;
          this.state.botomo_avatar="http://livedoor.blogimg.jp/subroku18/imgs/5/d/5d4883bd.png"
          break;
  case 3: this.state.greeting_text=botomo_greeting.maid;
          this.state.user_response=user_greeting.maid;
          this.state.botomo_avatar="http://i.osimg.com/vi/nTLIUBdJZ9.jpg"
          break;
  case 4: this.state.greeting_text=botomo_greeting.tsundere;
          this.state.user_response=user_greeting.tsundere;
          this.state.botomo_avatar="https://i.artfile.me/wallpaper/07-04-2017/360x225/anime-toaru-majutsu-no-index-devushka-vz-1149569.jpg"
          break;
  case 5: this.state.greeting_text=botomo_greeting.buddy;
          this.state.user_response=user_greeting.buddy;
          this.state.botomo_avatar="http://a17kennels.co.uk/wp-content/uploads/2013/01/success_cat-294x300.png"
          break;
}
var now_avatar=this.state.botomo_avatar;
var now_property=random;
//alert(now_avatar);
module.exports = {
  initial_message :[
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
        name: 'Botomo',
        avatar: this.state.botomo_avatar,
      },
    },
  ],
  avatar:now_avatar,
  property:now_property
};

//module.exports = {now_avatar,now_property};