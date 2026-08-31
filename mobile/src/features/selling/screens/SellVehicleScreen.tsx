import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { vehicleService } from '../../../services/vehicleService';
import { VehicleStatus } from '../../../types/vehicle';

export default function SellVehicleScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    make: '', model: '', year: '', price: '', mileage: '', fuelType: '',
    transmission: '', vehicleType: '', condition: '', engineCapacity: '',
    color: '', city: '', district: '', description: '',
  });

  const handlePublish = async () => {
    try {
      setLoading(true);
      const dataToSubmit = {
        ...form,
        year: parseInt(form.year),
        price: parseFloat(form.price),
        mileage: parseInt(form.mileage),
        engineCapacity: parseInt(form.engineCapacity),
        location: { city: form.city, district: form.district },
        images: [{ url: 'https://via.placeholder.com/400x300', isPrimary: true, order: 0 }],
        status: VehicleStatus.PENDING_REVIEW
      };
      
      const res = await vehicleService.createVehicle(dataToSubmit);
      if (res.success) {
        Alert.alert('Success', 'Vehicle submitted for review!');
        setStep(1);
        setForm({ make: '', model: '', year: '', price: '', mileage: '', fuelType: '', transmission: '', vehicleType: '', condition: '', engineCapacity: '', color: '', city: '', district: '', description: '' });
        navigation.navigate('Profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post an Ad</Text>
        <Text style={styles.stepText}>Step {step} of 3</Text>
      </View>

      <View style={styles.formContainer}>
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <TextInput style={styles.input} placeholder="Make (e.g. Toyota)" value={form.make} onChangeText={t => setForm({...form, make: t})} />
            <TextInput style={styles.input} placeholder="Model (e.g. Corolla)" value={form.model} onChangeText={t => setForm({...form, model: t})} />
            <TextInput style={styles.input} placeholder="Year (e.g. 2020)" keyboardType="numeric" value={form.year} onChangeText={t => setForm({...form, year: t})} />
            <TextInput style={styles.input} placeholder="Price (Rs.)" keyboardType="numeric" value={form.price} onChangeText={t => setForm({...form, price: t})} />
            <TouchableOpacity style={styles.btn} onPress={() => setStep(2)}><Text style={styles.btnText}>Next</Text></TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <TextInput style={styles.input} placeholder="Mileage (km)" keyboardType="numeric" value={form.mileage} onChangeText={t => setForm({...form, mileage: t})} />
            <TextInput style={styles.input} placeholder="Fuel Type (Petrol/Diesel/EV)" value={form.fuelType} onChangeText={t => setForm({...form, fuelType: t})} />
            <TextInput style={styles.input} placeholder="Transmission (Auto/Manual)" value={form.transmission} onChangeText={t => setForm({...form, transmission: t})} />
            <TextInput style={styles.input} placeholder="Vehicle Type (Car/SUV/Van)" value={form.vehicleType} onChangeText={t => setForm({...form, vehicleType: t})} />
            <TextInput style={styles.input} placeholder="Engine Capacity (cc)" keyboardType="numeric" value={form.engineCapacity} onChangeText={t => setForm({...form, engineCapacity: t})} />
            <TextInput style={styles.input} placeholder="Condition (New/Used)" value={form.condition} onChangeText={t => setForm({...form, condition: t})} />
            <TextInput style={styles.input} placeholder="Color" value={form.color} onChangeText={t => setForm({...form, color: t})} />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setStep(1)}><Text style={styles.btnOutlineText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1, marginLeft: 10 }]} onPress={() => setStep(3)}><Text style={styles.btnText}>Next</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>Final Details</Text>
            <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={t => setForm({...form, city: t})} />
            <TextInput style={styles.input} placeholder="District" value={form.district} onChangeText={t => setForm({...form, district: t})} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" multiline numberOfLines={4} value={form.description} onChangeText={t => setForm({...form, description: t})} />
            
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setStep(2)}><Text style={styles.btnOutlineText}>Back</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1, marginLeft: 10 }]} onPress={handlePublish} disabled={loading}>
                <Text style={styles.btnText}>{loading ? 'Submitting...' : 'Submit Listing'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, backgroundColor: '#fff', alignItems: 'center', elevation: 2, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  stepText: { color: '#868e96', marginTop: 5 },
  formContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#343a40' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dee2e6', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF', flex: 1 },
  btnOutlineText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});
