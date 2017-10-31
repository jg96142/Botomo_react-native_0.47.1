import React from 'react';
import { Text,Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Botomo } from './index.android';
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        onPress={() => navigate('Botomo')}
        title="Go to Lucy's profile"
      />
    ); 
  }
}