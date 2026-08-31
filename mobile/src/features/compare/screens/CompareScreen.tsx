import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCompareStore } from '../../../store/compareStore';

export default function CompareScreen() {
  const { vehicles, removeVehicle, clearVehicles } = useCompareStore();

  if (vehicles.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Select vehicles to compare</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehicle Comparison</Text>
        <TouchableOpacity onPress={clearVehicles}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.compareContainer}>
        {vehicles.map((v) => (
          <View key={v.id} style={styles.column}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.modelText}>{v.year} {v.make} {v.model}</Text>
            <Text style={styles.priceText}>Rs. {v.price.toLocaleString()}</Text>
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeVehicle(v.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>

            <View style={styles.featureRow}><Text style={styles.featureText}>{v.mileage} km</Text></View>
            <View style={styles.featureRow}><Text style={styles.featureText}>{v.transmission}</Text></View>
            <View style={styles.featureRow}><Text style={styles.featureText}>{v.fuelType}</Text></View>
            <View style={styles.featureRow}><Text style={styles.featureText}>{v.engineCapacity} cc</Text></View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#868e96' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  clearText: { color: 'red', fontSize: 16 },
  compareContainer: { paddingHorizontal: 15 },
  column: { width: 160, marginRight: 15, borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, padding: 10 },
  imagePlaceholder: { height: 100, backgroundColor: '#e9ecef', borderRadius: 8, marginBottom: 10 },
  modelText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  priceText: { color: '#007AFF', fontWeight: 'bold', marginBottom: 10 },
  removeBtn: { backgroundColor: '#ffe3e3', padding: 5, borderRadius: 5, alignItems: 'center', marginBottom: 15 },
  removeText: { color: 'red', fontSize: 12 },
  featureRow: { borderTopWidth: 1, borderTopColor: '#f1f3f5', paddingVertical: 10, alignItems: 'center' },
  featureText: { fontSize: 14, color: '#495057' }
});
