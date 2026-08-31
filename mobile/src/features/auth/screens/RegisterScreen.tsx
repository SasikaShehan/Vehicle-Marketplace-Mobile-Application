import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authService } from '../../../services/authService';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password || !form.phoneNumber) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    try {
      setLoading(true);
      const res = await authService.register(form);
      if (res.success) {
        Alert.alert('Success', 'Registration successful. Please login.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput style={styles.input} placeholder="Full Name" value={form.fullName} onChangeText={(t) => setForm({ ...form, fullName: t })} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" value={form.phoneNumber} onChangeText={(t) => setForm({ ...form, phoneNumber: t })} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={(t) => setForm({ ...form, password: t })} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#1a1a1a' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#007AFF', fontSize: 14 }
});
