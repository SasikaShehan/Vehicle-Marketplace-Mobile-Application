import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useVehicles } from '../../../hooks/useVehicles';
import { Search } from 'lucide-react-native';

export default function SearchScreen({ navigation }: any) {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Debounce logic for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, isLoading, error } = useVehicles({ keyword: debouncedKeyword });

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('VehicleDetails', { id: item.id })}>
      {/* Assuming item.images[0]?.url is handled in a real app via Image component */}
      <View style={styles.imagePlaceholder} />
      <View style={styles.cardContent}>
        <Text style={styles.vehicleTitle}>{item.year} {item.make} {item.model}</Text>
        <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
        <Text style={styles.details}>{item.mileage} km • {item.fuelType} • {item.transmission}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Search color="#666" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search make, model, keyword..."
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load vehicles.</Text>
        </View>
      ) : data?.data.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No vehicles found.</Text>
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          keyExtractor={(item) => item.id}
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
  searchHeader: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f5', borderRadius: 8, paddingHorizontal: 10 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  filterButton: { marginLeft: 10, paddingVertical: 12, paddingHorizontal: 15, backgroundColor: '#e7f5ff', borderRadius: 8 },
  filterText: { color: '#007AFF', fontWeight: 'bold' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3 },
  imagePlaceholder: { height: 180, backgroundColor: '#e9ecef' },
  cardContent: { padding: 15 },
  vehicleTitle: { fontSize: 18, fontWeight: 'bold', color: '#343a40', marginBottom: 5 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  details: { fontSize: 14, color: '#868e96' },
  errorText: { color: 'red' },
  emptyText: { color: '#868e96', fontSize: 16 }
});
