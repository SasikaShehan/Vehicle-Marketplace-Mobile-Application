import React from 'react';
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
import { Home, Search, Heart, Columns, PlusCircle, User, MessageCircle } from 'lucide-react-native';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Sell: undefined;
  Favorites: undefined;
  Compare: undefined;
  Messages: undefined;
  Dashboard: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007AFF', tabBarShowLabel: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarIcon: ({ color }) => <Search color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Sell" 
        component={SellVehicleScreen} 
        options={{ tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ tabBarIcon: ({ color }) => <Heart color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Compare" 
        component={CompareScreen} 
        options={{ tabBarIcon: ({ color }) => <Columns color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Dashboard" 
        component={SellerDashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
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
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="MyListings" component={MyListingsScreen} />
      <Stack.Screen name="SavedSearches" component={SavedSearchesScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Moderation" component={ModerationScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    </Stack.Navigator>
  );
}
