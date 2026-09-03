import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeaderTitle } from '@react-navigation/elements';

export default function CustomHeader({ navigation, route, options, back }: any) {
  const insets = useSafeAreaInsets();
  const title = getHeaderTitle(options, route.name);

  // Fallback for custom title if needed
  const displayTitle = title !== route.name ? title : (options.title || route.name);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {back ? (
          <TouchableOpacity onPress={navigation.goBack} style={styles.iconButton}>
            <ChevronLeft color="#1a1a1a" size={24} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconSpacer} />
        )}
        
        <Text style={styles.title} numberOfLines={1}>{displayTitle}</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Bell color="#1a1a1a" size={20} />
          {/* Notification dot indicator */}
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 15,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 42,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 15,
    letterSpacing: 0.3,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
    borderWidth: 1,
    borderColor: '#fff',
  }
});
