import React from 'react';
import { Button } from 'react-native-paper';
import { View, Text } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button mode="contained" onPress={() => navigation.navigate('Face Scan')}>
        Scan Your Skin
      </Button>
    </View>
  );
}
