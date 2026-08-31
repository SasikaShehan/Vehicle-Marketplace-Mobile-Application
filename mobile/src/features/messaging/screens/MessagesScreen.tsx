import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { chatService } from '../../../services/chatService';
import { MessageCircle } from 'lucide-react-native';
import EmptyState from '../../../components/ui/EmptyState';
import FadeInView from '../../../components/ui/FadeInView';

export default function MessagesScreen({ navigation }: any) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await chatService.getConversations();
        setConversations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const renderItem = ({ item, index }: any) => {
    const vehicle = item.vehicleId;
    return (
      <FadeInView delay={index * 100}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat', { conversationId: item._id, vehicleName: `${vehicle.make} ${vehicle.model}` })}>
          <View style={styles.content}>
            <Text style={styles.vehicleTitle}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || 'No messages yet'}</Text>
          </View>
          <Text style={styles.time}>
            {item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleDateString() : ''}
          </Text>
        </TouchableOpacity>
      </FadeInView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
      ) : conversations.length === 0 ? (
        <EmptyState 
          icon={MessageCircle} 
          title="No Messages" 
          description="When you contact a seller or someone inquires about your listing, it will appear here." 
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  emptyText: { color: '#868e96', fontSize: 16 },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  content: { flex: 1 },
  vehicleTitle: { fontSize: 16, fontWeight: 'bold', color: '#343a40', marginBottom: 5 },
  lastMessage: { fontSize: 14, color: '#868e96' },
  time: { fontSize: 12, color: '#adb5bd' }
});
