import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { sellerService } from '../../../services/sellerService';
import { vehicleService } from '../../../services/vehicleService';
import { Vehicle } from '../../../types/vehicle';
import EmptyState from '../../../components/ui/EmptyState';
import FadeInView from '../../../components/ui/FadeInView';
import { Car } from 'lucide-react-native';

export default function MyListingsScreen() {
  const [listings, setListings] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getMyListings();
      setListings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await vehicleService.deleteVehicle(id);
        fetchListings();
      }}
    ]);
  };

  const handleMarkSold = async (id: string) => {
    await sellerService.updateStatus(id, 'Sold');
    fetchListings();
  };

  const renderItem = ({ item, index }: { item: Vehicle, index: number }) => (
    <FadeInView delay={index * 100}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
          <View style={[styles.badge, item.status === 'Published' ? styles.badgeSuccess : styles.badgeWarning]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnAction} onPress={() => handleMarkSold(item.id)}>
            <Text style={styles.btnActionText}>Mark Sold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnAction, styles.btnDelete]} onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeInView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
      ) : listings.length === 0 ? (
        <EmptyState 
          icon={Car} 
          title="No Listings Yet" 
          description="You haven't posted any vehicles for sale. Tap 'Sell' to create your first ad." 
        />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#343a40' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeSuccess: { backgroundColor: '#d4edda' },
  badgeWarning: { backgroundColor: '#fff3cd' },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 18, color: '#007AFF', fontWeight: 'bold', marginBottom: 15 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#f1f3f5', paddingTop: 10 },
  btnAction: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6, backgroundColor: '#f1f3f5', marginLeft: 10 },
  btnActionText: { color: '#495057', fontWeight: 'bold' },
  btnDelete: { backgroundColor: '#ffe3e3' },
  btnDeleteText: { color: '#fa5252', fontWeight: 'bold' }
});
