import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { savedSearchService } from '../../../services/analyticsService';
import { Search, Bell, Trash2 } from 'lucide-react-native';
import EmptyState from '../../../components/ui/EmptyState';
import FadeInView from '../../../components/ui/FadeInView';

export default function SavedSearchesScreen({ navigation }: any) {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSearches = async () => {
    try {
      setLoading(true);
      const res = await savedSearchService.getSavedSearches();
      setSearches(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete', 'Remove this saved search?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await savedSearchService.deleteSavedSearch(id);
        fetchSearches();
      }}
    ]);
  };

  const renderItem = ({ item, index }: any) => (
    <FadeInView delay={index * 100}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Search', { filters: item.criteria })}>
        <View style={styles.cardHeader}>
          <Search color="#007AFF" size={20} />
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <View style={styles.criteriaList}>
          {Object.entries(item.criteria).map(([key, val]: any) => (
            <Text key={key} style={styles.criteriaText}>• {key}: {JSON.stringify(val)}</Text>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.notificationWrapper}>
            <Bell color={item.notificationsEnabled ? "#28a745" : "#ccc"} size={16} />
            <Text style={styles.notificationText}>{item.notificationsEnabled ? 'Alerts On' : 'Alerts Off'}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Trash2 color="#fa5252" size={20} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </FadeInView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Searches</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
      ) : searches.length === 0 ? (
        <EmptyState 
          icon={Search} 
          title="No Saved Searches" 
          description="Save your favorite search filters to get notified when new vehicles arrive." 
        />
      ) : (
        <FlatList
          data={searches}
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#343a40', marginLeft: 10 },
  criteriaList: { backgroundColor: '#f1f3f5', padding: 10, borderRadius: 8, marginBottom: 15 },
  criteriaText: { fontSize: 14, color: '#495057', marginBottom: 3 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f3f5', paddingTop: 10 },
  notificationWrapper: { flexDirection: 'row', alignItems: 'center' },
  notificationText: { marginLeft: 5, fontSize: 14, color: '#6c757d' }
});
