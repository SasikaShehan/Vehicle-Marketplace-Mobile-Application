import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Search, Car, Heart, ShieldCheck } from 'lucide-react-native';
import FadeInView from '../../components/ui/FadeInView';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <FadeInView delay={100} style={styles.header}>
        <Text style={styles.title}>Find Your Dream Vehicle</Text>
        <Text style={styles.subtitle}>Thousands of verified cars, bikes, and vans waiting for you.</Text>
      </FadeInView>

      <FadeInView delay={200} style={styles.searchSection}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Search color="#6c757d" size={20} />
          <Text style={styles.searchText}>Search make, model, or year...</Text>
        </TouchableOpacity>
      </FadeInView>

      <FadeInView delay={300} style={styles.categories}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryCard}>
            <Car color="#007AFF" size={32} />
            <Text style={styles.categoryText}>Cars</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}>
            <Heart color="#dc3545" size={32} />
            <Text style={styles.categoryText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}>
            <ShieldCheck color="#28a745" size={32} />
            <Text style={styles.categoryText}>Verified</Text>
          </TouchableOpacity>
        </View>
      </FadeInView>

      <FadeInView delay={400} style={styles.featured}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>✓ Trusted Sellers</Text>
          <Text style={styles.featureDesc}>Every seller is verified before they can post.</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>✓ Advanced Search</Text>
          <Text style={styles.featureDesc}>Filter by exactly what you need.</Text>
        </View>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  searchSection: { marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  searchText: { marginLeft: 10, color: '#6c757d' },
  categories: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  categoryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryCard: { alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '30%' },
  categoryText: { marginTop: 10, fontSize: 12 },
  featured: { marginBottom: 40 },
  featureItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  featureTitle: { fontWeight: 'bold', marginBottom: 5 },
  featureDesc: { color: '#666' }
});
