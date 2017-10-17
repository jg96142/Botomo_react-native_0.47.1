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
    text: '你是有什麼問題啦',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'http://www.freeiconspng.com/uploads/brown-white-cat-png-4.png',
    },
  },
];
