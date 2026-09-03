import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/home/HomeScreen';
import SearchScreen from '../features/search/screens/SearchScreen';
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen';
import CompareScreen from '../features/compare/screens/CompareScreen';
import SellVehicleScreen from '../features/selling/screens/SellVehicleScreen';
import SellerDashboardScreen from '../features/profile/screens/SellerDashboardScreen';
import MyListingsScreen from '../features/profile/screens/MyListingsScreen';
import MessagesScreen from '../features/messaging/screens/MessagesScreen';
import ChatScreen from '../features/messaging/screens/ChatScreen';
import SavedSearchesScreen from '../features/search/screens/SavedSearchesScreen';
import AdminDashboardScreen from '../features/admin/screens/AdminDashboardScreen';
import ModerationScreen from '../features/admin/screens/ModerationScreen';
import VehicleDetailsScreen from '../features/vehicles/screens/VehicleDetailsScreen';
import CustomHeader from '../components/ui/CustomHeader';
import { Home, Search, Heart, Columns, Plus, User, MessageCircle } from 'lucide-react-native';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Sell: undefined;
  Messages: undefined;
  Dashboard: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: true, 
        header: (props) => <CustomHeader {...props} />,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 35,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
              <Home color={focused ? '#F5A623' : '#8E8E93'} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ 
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
              <Search color={focused ? '#F5A623' : '#8E8E93'} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Sell" 
        component={SellVehicleScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
              top: -20,
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#FFCC00',
              shadowColor: '#F5A623',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 15,
              elevation: 10
            }}>
              <Plus color="#1A1A1A" size={32} strokeWidth={3} />
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
              <MessageCircle color={focused ? '#F5A623' : '#8E8E93'} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Dashboard" 
        component={SellerDashboardScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
              <User color={focused ? '#F5A623' : '#8E8E93'} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ) 
        }} 
      />
      
    </Tab.Navigator>
  );
}

export type AppStackParamList = {
  MainTabs: undefined;
  Chat: { conversationId: string; vehicleName: string };
  MyListings: undefined;
  SavedSearches: undefined;
  AdminDashboard: undefined;
  Moderation: undefined;
  VehicleDetails: { vehicleId: string };
  Favorites: undefined;
  Compare: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        header: (props) => <CustomHeader {...props} />
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ title: 'My Listings' }} />
      <Stack.Screen name="SavedSearches" component={SavedSearchesScreen} options={{ title: 'Saved Searches' }} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Panel' }} />
      <Stack.Screen name="Moderation" component={ModerationScreen} options={{ title: 'Moderation' }} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'My Favorites' }} />
      <Stack.Screen name="Compare" component={CompareScreen} options={{ title: 'Compare Vehicles' }} />
    </Stack.Navigator>
  );
}
