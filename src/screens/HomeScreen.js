// react-native-community-blur

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';
import {Avatar, Card} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/firestore';
import CustomListItem from '../components/CustomListItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {BlurView} from '@react-native-community/blur';

const HomeScreen = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Login');
      });
  };

  useEffect(() => {
    const unsubscribe = db()
      .collection('chats')
      .onSnapshot(snapshot =>
        setChats(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()}))),
      );
    return unsubscribe;
  }, []);

  const enterChat = (id, chatName, iconURL) => {
    navigation.navigate('Chat', {
      id,
      chatName,
      iconURL,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: {backgroundColor: '#2C6BED'},
      headerTitleStyle: {
        color: '#fff',
      },
      headerTinColor: '#fff',
      headerLeft: () => (
        <View style={{paddingLeft: 20}}>
          <TouchableOpacity onPress={signOut}>
            <Avatar
              rounded
              source={{
                uri: auth()?.currentUser?.photoURL
                  ? auth()?.currentUser?.photoURL
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyVSEPJut2FtINpbexjlW-PxQjDqV_jspoSw&usqp=CAU',
              }}
            />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
            marginRight: 20,
          }}>
          <TouchableOpacity>
            <AntDesign name="camerao" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddChat')}>
            <SimpleLineIcons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const chatId = id => {
    setSelectedChat(id);
    setShowModal(true);
  };

  return (
    <SafeAreaView>
      <StatusBar hidden={false} backgroundColor="#2C6BED" />
      {chats.length <= 0 ? (
        <Text
          style={{
            alignSelf: 'center',
            marginTop: 30,
            fontSize: 18,
            fontWeight: '500',
          }}>
          🤷‍♀No Chats Available🤷‍♂️
        </Text>
      ) : null}
      <ScrollView>
        {chats.map(({id, data}) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={data.chatName}
            iconURL={data.iconURL}
            enterChat={enterChat}
            chatId={chatId}
          />
        ))}
      </ScrollView>
      {selectedChat && (
        <Modal animationType="slide" transparent={true} visible={showModal}>
          <BlurView
            blurAmount={1}
            blurType="light"
            reducedTransparencyFallbackColor="white"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.absolute}
              onPress={() => {
                setSelectedChat(null);
                setShowModal(false);
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ImageBackground
                  source={{uri: chats[0].data.iconURL}}
                  style={styles.modal__image}>
                  <View style={styles.modal__detail}>
                    <Text style={styles.modal__text__title}>
                      {chats[0].data.chatName}
                    </Text>
                    <Text style={styles.modal__text}>
                      CreatedBy: {chats[0].data.createdBy}
                    </Text>
                    <Text style={styles.modal__text}>
                      CreatedAt:{' '}
                      {new Date(
                        chats[0].data.createdAt.toDate(),
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </BlurView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  modal__image: {
    width: '100%',
    height: 300,
  },
  modal__detail: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginLeft: 10,
  },
  modal__text__title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  modal__text: {
    fontSize: 16,
    fontWeight: '900',
    color: 'white',
  },
});
