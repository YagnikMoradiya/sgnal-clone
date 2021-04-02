import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';
import {launchImageLibrary} from 'react-native-image-picker';
import {Avatar} from 'react-native-elements';
import {firebase} from '@react-native-firebase/auth';

const AddChatScreen = ({navigation}) => {
  const [chat, setChat] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add a Chat',
      headerStyle: {backgroundColor: '#2C6BED'},
      headerTitleStyle: {
        color: '#fff',
      },
      headerTintColor: '#fff',
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

    // For Download URL
    task.then(async () => {
      const url = await reference.getDownloadURL();
      const newUrl = url.replace('.png', '.jpeg');
      setImageUrl(newUrl);
    });

    setLoading(false);
  };

  const createChat = async () => {
    await db()
      .collection('chats')
      .add({
        chatName: chat,
        iconURL: imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: auth().currentUser.displayName,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch(err => alert(err.message));
  };

  return (
    <View style={styles.container}>
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
          placeholder="Add a new chat"
          value={chat}
          onChangeText={text => setChat(text)}
          onSubmitEditing={createChat}
          leftIcon={<AntDesign name="wechat" size={24} color="black" />}
        />
      </View>
      <Button
        disabled={!loading && chat != '' ? false : true}
        title="Create"
        onPress={createChat}
        containerStyle={styles.button}
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input__container: {
    width: 300,
    margin: 15,
  },
  button: {
    width: 200,
    marginTop: 15,
  },
  avatar: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});
