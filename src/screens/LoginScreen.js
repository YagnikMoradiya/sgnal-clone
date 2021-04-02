import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      if (authUser) {
        navigation.replace('Home');
      }
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar hidden={false} backgroundColor="#2C6BED" />
      <Image
        source={require('../../assets/img/signal-logo.png')}
        style={{width: 200, height: 200}}
      />
      <View style={styles.input__container}>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={text => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>

      <Button title="Login" containerStyle={styles.button} onPress={signIn} />
      <Button
        title="Register"
        containerStyle={styles.button}
        type="outline"
        onPress={() => navigation.navigate('Register')}
      />

      <View style={{height: 50}} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  input__container: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
