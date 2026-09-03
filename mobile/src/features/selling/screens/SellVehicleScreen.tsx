import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronRight, ChevronLeft, CheckCircle, Car, MapPin, Settings } from 'lucide-react-native';
import { vehicleService } from '../../../services/vehicleService';
import { VehicleStatus } from '../../../types/vehicle';

export default function SellVehicleScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [form, setForm] = useState({
    make: '', model: '', year: '', price: '', mileage: '', fuelType: '',
    transmission: '', vehicleType: '', condition: '', engineCapacity: '',
    color: '', city: '', district: '', description: '',
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImageUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } else if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      
      // Client-side validation
      if (!form.make || !form.model || !form.year || !form.price || !form.mileage || !form.fuelType || !form.transmission || !form.vehicleType || !form.condition || !form.engineCapacity || !form.color || !form.city || !form.district || !form.description) {
        Alert.alert('Validation Error', 'Please fill in all the required fields before publishing.');
        setLoading(false);
        return;
      }
      if (form.description.length < 10) {
        Alert.alert('Validation Error', 'Description must be at least 10 characters long.');
        setLoading(false);
        return;
      }

      // Numeric validation
      const year = parseInt(form.year);
      const price = parseFloat(form.price);
      const mileage = parseInt(form.mileage);
      const engineCapacity = parseInt(form.engineCapacity);
      
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
        Alert.alert('Validation Error', 'Please enter a valid year (e.g., 2020).');
        setLoading(false);
        return;
      }
      if (isNaN(price) || price <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid positive price (numbers only, no commas).');
        setLoading(false);
        return;
      }
      if (isNaN(mileage) || mileage < 0) {
        Alert.alert('Validation Error', 'Please enter a valid mileage (numbers only).');
        setLoading(false);
        return;
      }
      if (isNaN(engineCapacity) || engineCapacity <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid engine capacity in cc (numbers only).');
        setLoading(false);
        return;
      }
      
      const dataToSubmit = {
        ...form,
        year,
        price,
        mileage,
        engineCapacity,
        location: { city: form.city, district: form.district },
        images: [{ url: imageUri || 'https://via.placeholder.com/400x300', isPrimary: true, order: 0 }],
        status: VehicleStatus.PUBLISHED
      };
      
      const res = await vehicleService.createVehicle(dataToSubmit);
      if (res.success) {
        Alert.alert('Success', 'Vehicle published successfully!');
        setStep(1);
        setForm({ make: '', model: '', year: '', price: '', mileage: '', fuelType: '', transmission: '', vehicleType: '', condition: '', engineCapacity: '', color: '', city: '', district: '', description: '' });
        setImageUri(null);
        navigation.navigate('Dashboard');
      }
    } catch (error: any) {
      const errData = error.response?.data;
      let errMsg = errData?.message || 'Submission failed';
      if (errData?.errors && Array.isArray(errData.errors)) {
        errMsg += '\\n' + errData.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('\\n');
      }
      Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
          </View>
          {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post an Ad</Text>
          <Text style={styles.headerSubtitle}>Sell your vehicle fast and easy</Text>
        </View>
        
        {renderStepIndicator()}

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.formContainer}>
            {step === 1 && (
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Car color="#007AFF" size={24} />
                  <Text style={styles.sectionTitle}>Basic Details</Text>
                </View>
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Make (e.g. Toyota)" value={form.make} onChangeText={t => setForm({...form, make: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Model (e.g. Corolla)" value={form.model} onChangeText={t => setForm({...form, model: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Year (e.g. 2020)" keyboardType="numeric" value={form.year} onChangeText={t => setForm({...form, year: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Price (Rs.)" keyboardType="numeric" value={form.price} onChangeText={t => setForm({...form, price: t})} />
                
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setStep(2)}>
                  <Text style={styles.btnPrimaryText}>Next Step</Text>
                  <ChevronRight color="#fff" size={20} />
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Settings color="#007AFF" size={24} />
                  <Text style={styles.sectionTitle}>Specifications</Text>
                </View>
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Mileage (km)" keyboardType="numeric" value={form.mileage} onChangeText={t => setForm({...form, mileage: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Fuel Type (Petrol/Diesel/EV)" value={form.fuelType} onChangeText={t => setForm({...form, fuelType: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Transmission (Auto/Manual)" value={form.transmission} onChangeText={t => setForm({...form, transmission: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Vehicle Type (Car/SUV/Van)" value={form.vehicleType} onChangeText={t => setForm({...form, vehicleType: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Engine Capacity (cc)" keyboardType="numeric" value={form.engineCapacity} onChangeText={t => setForm({...form, engineCapacity: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Condition (New/Used)" value={form.condition} onChangeText={t => setForm({...form, condition: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="Color" value={form.color} onChangeText={t => setForm({...form, color: t})} />
                
                <View style={styles.row}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(1)}>
                    <ChevronLeft color="#007AFF" size={20} />
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnPrimary, { flex: 1.5, marginLeft: 15 }]} onPress={() => setStep(3)}>
                    <Text style={styles.btnPrimaryText}>Next Step</Text>
                    <ChevronRight color="#fff" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <MapPin color="#007AFF" size={24} />
                  <Text style={styles.sectionTitle}>Final Details</Text>
                </View>
                
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Camera color="#007AFF" size={40} />
                      <Text style={styles.imagePlaceholderText}>Tap to add vehicle image</Text>
                    </View>
                  )}
                  {imageUri && <View style={styles.changeImageOverlay}><Text style={styles.changeImageText}>Change Image</Text></View>}
                </TouchableOpacity>
                
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="City" value={form.city} onChangeText={t => setForm({...form, city: t})} />
                <TextInput style={styles.input} placeholderTextColor="#999" placeholder="District" value={form.district} onChangeText={t => setForm({...form, district: t})} />
                <TextInput style={[styles.input, styles.textArea]} placeholderTextColor="#999" placeholder="Description (Tell us more about the vehicle)" multiline numberOfLines={4} value={form.description} onChangeText={t => setForm({...form, description: t})} />
                
                <View style={styles.row}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(2)}>
                    <ChevronLeft color="#007AFF" size={20} />
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnPrimary, { flex: 1.5, marginLeft: 15, backgroundColor: '#28a745' }]} onPress={handlePublish} disabled={loading}>
                    {loading ? (
                      <Text style={styles.btnPrimaryText}>Publishing...</Text>
                    ) : (
                      <>
                        <Text style={styles.btnPrimaryText}>Publish Ad</Text>
                        <CheckCircle color="#fff" size={20} style={{ marginLeft: 5 }} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f6f8' },
  container: { flex: 1 },
  header: { padding: 20, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  
  stepIndicatorContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, backgroundColor: '#fff', marginBottom: 10 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: '#007AFF' },
  stepNumber: { color: '#666', fontWeight: 'bold', fontSize: 16 },
  stepNumberActive: { color: '#fff' },
  stepLine: { width: 40, height: 3, backgroundColor: '#e0e0e0', marginHorizontal: 5 },
  stepLineActive: { backgroundColor: '#007AFF' },
  
  formContainer: { paddingHorizontal: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginLeft: 10 },
  
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16, color: '#333' },
  textArea: { height: 120, textAlignVertical: 'top' },
  
  btnPrimary: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 5 },
  
  btnSecondary: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 },
  btnSecondaryText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  
  imagePickerBtn: { backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0', borderStyle: 'dashed', overflow: 'hidden' },
  imagePlaceholder: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { color: '#666', marginTop: 10, fontSize: 16, fontWeight: '500' },
  previewImage: { width: '100%', height: 220, resizeMode: 'cover' },
  changeImageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, alignItems: 'center' },
  changeImageText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
