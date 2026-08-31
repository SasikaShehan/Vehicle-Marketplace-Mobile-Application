import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { analyticsService } from '../../../services/analyticsService';
import { BarChart, Users, Eye, CheckCircle, Clock } from 'lucide-react-native';

export default function SellerDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getSellerDashboard();
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <BarChart color="#007AFF" size={32} />
          <Text style={styles.cardValue}>{stats?.totalListings || 0}</Text>
          <Text style={styles.cardLabel}>Total Listings</Text>
        </View>
        <View style={styles.card}>
          <CheckCircle color="#28a745" size={32} />
          <Text style={styles.cardValue}>{stats?.activeListings || 0}</Text>
          <Text style={styles.cardLabel}>Active</Text>
        </View>
        <View style={styles.card}>
          <Clock color="#ffc107" size={32} />
          <Text style={styles.cardValue}>{stats?.draftListings || 0}</Text>
          <Text style={styles.cardLabel}>Drafts / Pending</Text>
        </View>
        <View style={styles.card}>
          <Users color="#6c757d" size={32} />
          <Text style={styles.cardValue}>{stats?.soldListings || 0}</Text>
          <Text style={styles.cardLabel}>Sold</Text>
        </View>
        <View style={[styles.card, styles.cardFull]}>
          <Eye color="#17a2b8" size={32} />
          <Text style={styles.cardValue}>{stats?.totalViews?.toLocaleString() || 0}</Text>
          <Text style={styles.cardLabel}>Total Profile & Listing Views</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.manageBtn} onPress={() => navigation.navigate('MyListings')}>
        <Text style={styles.manageBtnText}>Manage My Listings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#fff', alignItems: 'center', elevation: 2, marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  cardFull: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 30 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#343a40', marginVertical: 8 },
  cardLabel: { fontSize: 14, color: '#6c757d', textAlign: 'center' },
  manageBtn: { margin: 15, backgroundColor: '#007AFF', padding: 15, borderRadius: 12, alignItems: 'center' },
  manageBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
