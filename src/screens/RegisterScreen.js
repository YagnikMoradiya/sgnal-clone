import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Button, Input, Text, Avatar} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {launchImageLibrary} from 'react-native-image-picker';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConpassword] = useState('');
  const [status, setStatus] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'none',
    });
  }, [navigation]);

  let options = {
    mediaType: 'photo',
    quality: 1,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const chooseImage = async () => {
    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorMessage) {
        console.log('Error Message: ', response.errorMessage);
      } else {
        uploadImage(response);
      }
    });
  };

  const uploadImage = async response => {
    setLoading(true);

    const id = nanoid().toString();
    const reference = storage().ref(id);

    const task = reference.putFile(response.uri);

    // Observer for percentage
    task.on('state_changed', taskSnapshot => {
      const percentage =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000;

      setStatus(percentage);
    });

    // For Download URL
    task.then(async () => {
      const url = await reference.getDownloadURL();
      const newUrl = url.replace('.png', '.jpeg');
      setImageUrl(newUrl);
    });

    setLoading(false);
  };

  const signUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(snapshot => {
        snapshot.user.updateProfile({
          displayName: name,
          photoURL: imageUrl,
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{status} %</Text>
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar hidden={false} backgroundColor="#2C6BED" />
        <Text h3 style={{marginBottom: 50}}>
          Create an Account
        </Text>
        <View style={styles.input__container}>
          <Avatar
            rounded
            source={{
              uri: imageUrl
                ? imageUrl
                : 'https://i.pinimg.com/originals/2d/0f/50/2d0f50e8e4f6b233c7cf70b4bd36f89c.png',
            }}
            onPress={chooseImage}
            style={styles.avatar}
          />
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={text => setName(text)}
          />
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
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry
            type="password"
            value={conPassword}
            onChangeText={text => {
              setConpassword(text);
            }}
            onSubmitEditing={signUp}
          />
          {password != conPassword ? (
            <Text
              style={{
                fontSize: 13,
                alignSelf: 'center',
                marginBottom: 5,
                color: '#e84118',
              }}>
              Password does not match
            </Text>
          ) : null}
        </View>

        <Button
          title="Register"
          onPress={signUp}
          containerStyle={styles.button}
        />
        <Button
          title="Already have an account?"
          onPress={signUp}
          containerStyle={styles.button}
          type="outline"
          onPress={() => navigation.navigate('Login')}
        />

        <View style={{height: 50}} />
      </KeyboardAvoidingView>
    );
  }
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  input__container: {
    width: 300,
  },
  avatar: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  button: {
    width: 250,
    marginTop: 10,
  },
});
