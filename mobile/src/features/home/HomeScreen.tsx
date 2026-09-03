import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Search, Car, Heart, ShieldCheck, MapPin, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FadeInView from '../../components/ui/FadeInView';
import { vehicleService } from '../../services/vehicleService';
import { useAuthStore } from '../../store/authStore';
import { Vehicle } from '../../types/vehicle';

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore(state => state.user);
  const [recentAds, setRecentAds] = useState<Vehicle[]>([]);
  const [allAds, setAllAds] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch Recent Ads (No Filter, just latest)
          const recentRes = await vehicleService.getVehicles({ limit: 5, sort: 'newest' });
          if (isActive) setRecentAds(recentRes.data);

          // Fetch All Ads (With Filter)
          const allParams: any = { limit: 20, sort: 'newest' };
          if (activeFilter !== 'All') {
            allParams.vehicleType = activeFilter;
          }
          const allRes = await vehicleService.getVehicles(allParams);
          if (isActive) setAllAds(allRes.data);
        } catch (error) {
          console.error('Failed to fetch vehicles', error);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      
      fetchData();
      
      return () => {
        isActive = false;
      };
    }, [activeFilter])
  );

  const renderVehicleCard = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      style={styles.adCard} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('VehicleDetails', { vehicleId: item.id || (item as any)._id })}
    >
      <Image 
        source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/400x300' }} 
        style={styles.adImage} 
      />
      <View style={styles.adContent}>
        <View style={styles.adHeader}>
          <Text style={styles.adTitle} numberOfLines={1}>{item.year} {item.make} {item.model}</Text>
          <Text style={styles.adPrice}>Rs. {item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.adFooter}>
          <View style={styles.adLocation}>
            <MapPin color="#8E8E93" size={14} />
            <Text style={styles.adLocationText}>{item.location.city}</Text>
          </View>
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>{item.condition}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVerticalVehicleCard = (item: Vehicle) => (
    <TouchableOpacity 
      key={item.id || (item as any)._id}
      style={styles.verticalAdCard} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('VehicleDetails', { vehicleId: item.id || (item as any)._id })}
    >
      <Image 
        source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/400x300' }} 
        style={styles.verticalAdImage} 
      />
      <View style={styles.verticalAdContent}>
        <View>
          <Text style={styles.verticalAdTitle} numberOfLines={1}>{item.year} {item.make} {item.model}</Text>
          <Text style={styles.verticalAdPrice}>Rs. {item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.verticalAdFooter}>
          <View style={styles.adLocation}>
            <MapPin color="#8E8E93" size={12} />
            <Text style={styles.adLocationText}>{item.location.city}</Text>
          </View>
          <Text style={styles.verticalAdMileage}>{item.mileage.toLocaleString()} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.topBackground}>
          <FadeInView delay={100} style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi {user?.fullName?.split(' ')[0] || 'User'} 👋</Text>
              <Text style={styles.title}>Find Your Dream Vehicle</Text>
            </View>
          </FadeInView>

          <FadeInView delay={200} style={styles.searchSection}>
            <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')} activeOpacity={0.9}>
              <Search color="#8E8E93" size={20} />
              <Text style={styles.searchText}>Search make, model, or year...</Text>
            </TouchableOpacity>
          </FadeInView>
        </View>

        <FadeInView delay={250} style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
            {['All', 'Car', 'SUV', 'Van', 'Motorcycle', 'Electric Vehicle'].map((filter) => (
              <TouchableOpacity 
                key={filter} 
                style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeInView>

        <FadeInView delay={300} style={styles.recentAdsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#FFCC00" style={{ marginVertical: 40 }} />
          ) : (
            <FlatList
              data={recentAds}
              keyExtractor={(item: any) => item.id || item._id || Math.random().toString()}
              renderItem={renderVehicleCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.adList}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={280 + 15}
            />
          )}
        </FadeInView>

        <FadeInView delay={400} style={styles.categories}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFF9E6' }]}>
                <Car color="#F5A623" size={28} />
              </View>
              <Text style={styles.categoryText}>Cars</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard} onPress={() => navigation.navigate('Favorites')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
                <Heart color="#dc3545" size={28} />
              </View>
              <Text style={styles.categoryText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <ShieldCheck color="#28a745" size={28} />
              </View>
              <Text style={styles.categoryText}>Verified</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <FadeInView delay={500} style={styles.allAdsSection}>
          <Text style={styles.sectionTitle}>Explore All Ads</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#FFCC00" style={{ marginVertical: 40 }} />
          ) : (
            <View style={styles.verticalAdList}>
              {allAds.map(renderVerticalVehicleCard)}
            </View>
          )}
        </FadeInView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#10B981' }, // Premium Light Green (Emerald)
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topBackground: {
    backgroundColor: '#10B981',
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  greeting: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 4, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  searchSection: { paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  searchText: { marginLeft: 12, color: '#8E8E93', fontSize: 16 },
  
  filterSection: { marginBottom: 25 },
  filterList: { paddingHorizontal: 20, paddingRight: 40 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E5E5EA', marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  filterChipActive: { backgroundColor: '#FFCC00', borderColor: '#FFCC00' },
  filterChipText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  filterChipTextActive: { color: '#1A1A1A' },

  recentAdsSection: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  seeAllText: { fontSize: 14, color: '#F5A623', fontWeight: '600' },
  
  adList: { paddingHorizontal: 20, paddingBottom: 10 },
  adCard: { width: 280, backgroundColor: '#fff', borderRadius: 20, marginRight: 15, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5, overflow: 'hidden' },
  adImage: { width: '100%', height: 160, resizeMode: 'cover' },
  adContent: { padding: 15 },
  adHeader: { marginBottom: 10 },
  adTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  adPrice: { fontSize: 18, fontWeight: '800', color: '#F5A623' },
  adFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adLocation: { flexDirection: 'row', alignItems: 'center' },
  adLocationText: { fontSize: 13, color: '#8E8E93', marginLeft: 4, fontWeight: '500' },
  adBadge: { backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  adBadgeText: { fontSize: 11, color: '#1C1C1E', fontWeight: '600', textTransform: 'uppercase' },

  categories: { paddingHorizontal: 20, marginBottom: 30 },
  categoryGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  categoryCard: { alignItems: 'center', flex: 1 },
  iconWrapper: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },

  allAdsSection: { paddingHorizontal: 20, paddingBottom: 100 },
  verticalAdList: { marginTop: 15 },
  verticalAdCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 15, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  verticalAdImage: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#f0f0f0' },
  verticalAdContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  verticalAdTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  verticalAdPrice: { fontSize: 16, fontWeight: '800', color: '#F5A623' },
  verticalAdFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  verticalAdMileage: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
});
