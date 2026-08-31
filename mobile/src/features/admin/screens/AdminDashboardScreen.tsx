import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { adminService } from '../../../services/adminService';
import { Users, Car, AlertTriangle, MessageCircle } from 'lucide-react-native';

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getPlatformAnalytics();
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
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Users color="#007AFF" size={32} />
          <Text style={styles.cardValue}>{stats?.totalUsers || 0}</Text>
          <Text style={styles.cardLabel}>Total Users</Text>
        </View>
        <View style={styles.card}>
          <Car color="#28a745" size={32} />
          <Text style={styles.cardValue}>{stats?.totalVehicles || 0}</Text>
          <Text style={styles.cardLabel}>Total Vehicles</Text>
        </View>
        <View style={styles.card}>
          <AlertTriangle color="#ffc107" size={32} />
          <Text style={styles.cardValue}>{stats?.pendingVehicles || 0}</Text>
          <Text style={styles.cardLabel}>Pending Review</Text>
        </View>
        <View style={styles.card}>
          <MessageCircle color="#6c757d" size={32} />
          <Text style={styles.cardValue}>{stats?.activeChats || 0}</Text>
          <Text style={styles.cardLabel}>Active Chats</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.manageBtn} onPress={() => navigation.navigate('Moderation')}>
        <Text style={styles.manageBtnText}>Review Pending Vehicles ({stats?.pendingVehicles || 0})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#343a40', alignItems: 'center', elevation: 2, marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#343a40', marginVertical: 8 },
  cardLabel: { fontSize: 14, color: '#6c757d', textAlign: 'center' },
  manageBtn: { margin: 15, backgroundColor: '#dc3545', padding: 15, borderRadius: 12, alignItems: 'center' },
  manageBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
