import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { chatService } from '../../../services/chatService';
import { useAuthStore } from '../../../store/authStore';

export default function ChatScreen({ route, navigation }: any) {
  const { conversationId, vehicleName } = route.params;
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    try {
      const res = await chatService.getMessages(conversationId);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Simulate real-time polling
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const tempMsg = { _id: Date.now().toString(), senderId: user?.id, text, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setText('');
      await chatService.sendMessage(conversationId, text);
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: any) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{vehicleName}</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  backBtn: { color: '#007AFF', fontSize: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  list: { padding: 15 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  bubbleMe: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#e9ecef', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16 },
  messageTextMe: { color: '#fff' },
  messageTextOther: { color: '#212529' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#dee2e6' },
  input: { flex: 1, backgroundColor: '#f1f3f5', borderRadius: 20, paddingHorizontal: 15, fontSize: 16, marginRight: 10, maxHeight: 100 },
  sendBtn: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 },
  sendBtnText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 }
});
