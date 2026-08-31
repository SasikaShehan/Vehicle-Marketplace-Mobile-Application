import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { adminService } from '../../../services/adminService';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function ModerationScreen() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingVehicles();
      setVehicles(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleModerate = async (id: string, action: 'Approve' | 'Reject') => {
    Alert.alert(`Confirm ${action}`, `Are you sure you want to ${action.toLowerCase()} this listing?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: action === 'Approve' ? 'default' : 'destructive', onPress: async () => {
        await adminService.moderateVehicle(id, action);
        fetchPending();
      }}
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
      <Text style={styles.seller}>Seller: {item.sellerId?.fullName} ({item.sellerId?.email})</Text>
      <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnReject} onPress={() => handleModerate(item._id, 'Reject')}>
          <XCircle color="#fa5252" size={20} />
          <Text style={styles.btnRejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnApprove} onPress={() => handleModerate(item._id, 'Approve')}>
          <CheckCircle color="#fff" size={20} />
          <Text style={styles.btnApproveText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Content Moderation</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
      ) : vehicles.length === 0 ? (
        <View style={styles.center}><Text style={styles.emptyText}>No pending vehicles.</Text></View>
      ) : (
        <FlatList
          data={vehicles}
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
  header: { padding: 20, backgroundColor: '#343a40', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  emptyText: { color: '#868e96', fontSize: 16 },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#343a40', marginBottom: 5 },
  seller: { fontSize: 14, color: '#6c757d', marginBottom: 5 },
  price: { fontSize: 16, color: '#007AFF', fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#495057', marginBottom: 15 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f3f5', paddingTop: 15 },
  btnReject: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#ffe3e3', flex: 1, justifyContent: 'center', marginRight: 10 },
  btnRejectText: { color: '#fa5252', fontWeight: 'bold', marginLeft: 5 },
  btnApprove: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#28a745', flex: 1, justifyContent: 'center' },
  btnApproveText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 }
});
