import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import db from '@react-native-firebase/firestore';
import {log} from 'react-native-reanimated';

const CustomListItem = ({id, chatName, enterChat, iconURL, chatId}) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db()
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        ),
      );
    return unsubscribe;
  }, []);

  return (
    <ListItem
      key={id}
      bottomDivider={true}
      onPress={() => enterChat(id, chatName, iconURL)}
      onLongPress={() => {
        chatId(id);
      }}
      key={id}>
      <Avatar
        rounded
        source={{
          uri: iconURL || messages?.[0]?.data.photoURL,
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{fontWeight: '800'}}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {messages?.[0]?.data.displayName}: {messages?.[0]?.data.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
