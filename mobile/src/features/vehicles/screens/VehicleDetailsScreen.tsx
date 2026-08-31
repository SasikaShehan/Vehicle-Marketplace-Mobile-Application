import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { vehicleService } from '../../../services/vehicleService';
import { useCompareStore } from '../../../store/compareStore';
import { Heart, MessageCircle, Share2, AlertTriangle, MapPin, Gauge, Box, Columns, Info } from 'lucide-react-native';
import { api } from '../../../services/api';

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

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  if (!vehicle) return <View style={styles.center}><Text>Vehicle not found</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        <Image 
          source={{ uri: vehicle.images?.[0]?.url || 'https://via.placeholder.com/800x600' }} 
          style={styles.heroImage} 
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>{'< Back'}</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Heart color={isFavorite ? "#fa5252" : "#6c757d"} fill={isFavorite ? "#fa5252" : "transparent"} size={28} />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>Rs. {vehicle.price.toLocaleString()}</Text>
          <View style={styles.locationRow}>
            <MapPin color="#6c757d" size={16} />
            <Text style={styles.locationText}>{vehicle.location?.city}, {vehicle.location?.district}</Text>
          </View>
        </View>

        {/* Quick Specs */}
        <View style={styles.quickSpecs}>
          <View style={styles.specItem}>
            <Gauge color="#495057" size={24} />
            <Text style={styles.specValue}>{vehicle.mileage.toLocaleString()} km</Text>
          </View>
          <View style={styles.specItem}>
            <Box color="#495057" size={24} />
            <Text style={styles.specValue}>{vehicle.transmission}</Text>
          </View>
          <View style={styles.specItem}>
            <Info color="#495057" size={24} />
            <Text style={styles.specValue}>{vehicle.fuelType}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{vehicle.description}</Text>
        </View>

        {/* Full Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specRow}><Text style={styles.specLabel}>Engine:</Text><Text style={styles.specVal}>{vehicle.engineCapacity} cc</Text></View>
          <View style={styles.specRow}><Text style={styles.specLabel}>Body Type:</Text><Text style={styles.specVal}>{vehicle.vehicleType}</Text></View>
          <View style={styles.specRow}><Text style={styles.specLabel}>Condition:</Text><Text style={styles.specVal}>{vehicle.condition}</Text></View>
          
          <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
            <AlertTriangle color="#fa5252" size={16} />
            <Text style={styles.reportBtnText}>Report this listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.iconActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Share2 color="#343a40" size={24} />
            <Text style={styles.iconBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleCompare}>
            <Columns color="#343a40" size={24} />
            <Text style={styles.iconBtnText}>Compare</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContactSeller}>
          <MessageCircle color="#fff" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.contactBtnText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: 300, resizeMode: 'cover' },
  backBtn: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  backBtnText: { color: '#fff', fontWeight: 'bold' },
  headerInfo: { padding: 20, backgroundColor: '#fff' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#343a40', flex: 1, marginRight: 10 },
  price: { fontSize: 22, color: '#007AFF', fontWeight: 'bold', marginTop: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  locationText: { color: '#6c757d', marginLeft: 5, fontSize: 14 },
  quickSpecs: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f3f5', borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  specItem: { alignItems: 'center' },
  specValue: { marginTop: 8, fontSize: 14, color: '#495057', fontWeight: 'bold' },
  section: { padding: 20, backgroundColor: '#fff', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#343a40' },
  description: { fontSize: 15, lineHeight: 24, color: '#495057' },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' },
  specLabel: { color: '#6c757d', fontSize: 15 },
  specVal: { color: '#343a40', fontSize: 15, fontWeight: '500' },
  bottomBar: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  iconActions: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', alignItems: 'center' },
  iconBtn: { alignItems: 'center' },
  iconBtnText: { fontSize: 12, marginTop: 4, color: '#343a40' },
  contactBtn: { flex: 1, backgroundColor: '#007AFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 12, paddingVertical: 12, marginLeft: 10 },
  contactBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 15, backgroundColor: '#ffe3e3', borderRadius: 10 },
  reportBtnText: { color: '#fa5252', marginLeft: 8, fontWeight: 'bold' }
});
