'use client';

import { StyleSheet, Text, View, Button } from 'react-native';
import log from './test.jsx';
import AppPy from './Client.py';
import { componentFromServer } from './server.py';
//import componentFromServer from './test.js';
import utils from './src/utils';

console.log(utils);

console.log('hulu');

function App() {
  const [el, setEl] = (() => require('react'))().useState(null);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Hello" onPress={() => setEl(componentFromServer('dor'))}/>
      {el}
      <AppPy/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
