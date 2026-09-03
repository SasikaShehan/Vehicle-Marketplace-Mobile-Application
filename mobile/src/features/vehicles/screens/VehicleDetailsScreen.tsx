import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Share, Dimensions, StatusBar, Platform } from 'react-native';
import { vehicleService } from '../../../services/vehicleService';
import { useCompareStore } from '../../../store/compareStore';
import { Heart, MessageCircle, Share2, AlertTriangle, MapPin, Gauge, Box, Info, ChevronLeft, PhoneCall } from 'lucide-react-native';
import { api } from '../../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function VehicleDetailsScreen({ route, navigation }: any) {
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const addVehicle = useCompareStore(state => state.addVehicle);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await vehicleService.getVehicleById(vehicleId);
        setVehicle(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [vehicleId]);

  const handleContactSeller = () => {
    navigation.navigate('Chat', { conversationId: 'new', vehicleName: `${vehicle.make} ${vehicle.model}` });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for Rs. ${vehicle.price.toLocaleString()} on Vehicle Marketplace!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompare = () => {
    try {
      addVehicle(vehicle);
      Alert.alert('Added to Compare', 'Vehicle added to your comparison list.');
    } catch (e: any) {
      Alert.alert('Limit Reached', e.message);
    }
  };

  const handleReport = () => {
    Alert.prompt('Report Listing', 'Reason for reporting:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Report', onPress: async (text?: string) => {
        if (!text) return;
        try {
          await api.post(`/vehicles/${vehicleId}/report`, { reason: text });
          Alert.alert('Reported', 'Thank you. The listing has been reported to admins.');
        } catch (e: any) {
          Alert.alert('Error', e.response?.data?.message || 'Failed to report listing');
        }
      }}
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  if (!vehicle) return <View style={styles.center}><Text style={styles.errorText}>Vehicle not found</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: vehicle.images?.[0]?.url || 'https://via.placeholder.com/800x600' }} 
            style={styles.heroImage} 
          />
          <View style={styles.imageOverlay} />
          <SafeAreaView style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <ChevronLeft color="#1C1C1E" size={24} />
            </TouchableOpacity>
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <Share2 color="#1C1C1E" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { marginLeft: 10 }]} onPress={() => setIsFavorite(!isFavorite)}>
                <Heart color={isFavorite ? "#fa5252" : "#1C1C1E"} fill={isFavorite ? "#fa5252" : "transparent"} size={22} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Header Details */}
        <View style={styles.contentContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{vehicle.condition}</Text></View>
            <View style={[styles.badge, { backgroundColor: '#E3F2FD' }]}><Text style={[styles.badgeText, { color: '#007AFF' }]}>{vehicle.year}</Text></View>
          </View>
          
          <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.price}>Rs. {vehicle.price.toLocaleString()}</Text>
          
          <View style={styles.locationRow}>
            <MapPin color="#8E8E93" size={18} />
            <Text style={styles.locationText}>{vehicle.location?.city}, {vehicle.location?.district}</Text>
          </View>
        </View>

        {/* Quick Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specCard}>
            <View style={styles.specIconWrap}><Gauge color="#007AFF" size={22} /></View>
            <Text style={styles.specLabel}>Mileage</Text>
            <Text style={styles.specValue}>{vehicle.mileage.toLocaleString()} km</Text>
          </View>
          <View style={styles.specCard}>
            <View style={styles.specIconWrap}><Box color="#007AFF" size={22} /></View>
            <Text style={styles.specLabel}>Transmission</Text>
            <Text style={styles.specValue}>{vehicle.transmission}</Text>
          </View>
          <View style={styles.specCard}>
            <View style={styles.specIconWrap}><Info color="#007AFF" size={22} /></View>
            <Text style={styles.specLabel}>Fuel Type</Text>
            <Text style={styles.specValue}>{vehicle.fuelType}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>{vehicle.description}</Text>
        </View>

        {/* Full Specifications List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Specifications</Text>
          <View style={styles.specList}>
            <View style={styles.specRow}><Text style={styles.specRowLabel}>Engine Capacity</Text><Text style={styles.specRowValue}>{vehicle.engineCapacity} cc</Text></View>
            <View style={styles.specRow}><Text style={styles.specRowLabel}>Body Type</Text><Text style={styles.specRowValue}>{vehicle.vehicleType}</Text></View>
            <View style={styles.specRow}><Text style={styles.specRowLabel}>Exterior Color</Text><Text style={styles.specRowValue}>{vehicle.color}</Text></View>
            <View style={[styles.specRow, { borderBottomWidth: 0 }]}><Text style={styles.specRowLabel}>Condition</Text><Text style={styles.specRowValue}>{vehicle.condition}</Text></View>
          </View>
          
          <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
            <AlertTriangle color="#fa5252" size={18} />
            <Text style={styles.reportBtnText}>Report this listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.floatingActionBar}>
        <TouchableOpacity style={styles.compareBtn} onPress={handleCompare}>
          <Text style={styles.compareBtnText}>Compare</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContactSeller}>
          <PhoneCall color="#fff" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.contactBtnText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#8E8E93', fontWeight: '500' },
  
  imageContainer: { width: '100%', height: 350, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.2)' },
  
  topActions: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  rightActions: { flexDirection: 'row' },
  
  contentContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  badgeRow: { flexDirection: 'row', marginBottom: 12 },
  badge: { backgroundColor: '#F2F2F7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 10 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#1C1C1E', textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '800', color: '#1C1C1E', marginBottom: 8, letterSpacing: -0.5 },
  price: { fontSize: 24, fontWeight: '800', color: '#007AFF', marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { color: '#8E8E93', fontSize: 15, fontWeight: '500', marginLeft: 6 },
  
  specsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 },
  specCard: { backgroundColor: '#fff', width: (width - 60) / 3, padding: 15, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  specIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  specLabel: { fontSize: 12, color: '#8E8E93', marginBottom: 4, fontWeight: '500' },
  specValue: { fontSize: 14, color: '#1C1C1E', fontWeight: '700' },
  
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 15 },
  description: { fontSize: 15, lineHeight: 24, color: '#4A4A4A' },
  
  specList: { backgroundColor: '#fff', borderRadius: 16, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  specRowLabel: { color: '#8E8E93', fontSize: 15, fontWeight: '500' },
  specRowValue: { color: '#1C1C1E', fontSize: 15, fontWeight: '600' },
  
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 15, backgroundColor: '#FFF0F0', borderRadius: 12 },
  reportBtnText: { color: '#fa5252', marginLeft: 8, fontWeight: '700', fontSize: 15 },
  
  floatingActionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, paddingBottom: Platform.OS === 'ios' ? 30 : 15, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 10 },
  compareBtn: { flex: 1, backgroundColor: '#F2F2F7', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginRight: 10 },
  compareBtnText: { color: '#1C1C1E', fontSize: 16, fontWeight: '700' },
  contactBtn: { flex: 2, backgroundColor: '#007AFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  contactBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
