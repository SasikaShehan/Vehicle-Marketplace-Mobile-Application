import { create } from 'zustand';
import { Vehicle } from '../types/vehicle';
import { Alert } from 'react-native';

interface CompareState {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  clearVehicles: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  vehicles: [],
  
  addVehicle: (vehicle: Vehicle) => {
    const current = get().vehicles;
    if (current.find(v => v.id === vehicle.id)) {
      return Alert.alert('Already added', 'This vehicle is already in the comparison list.');
    }
    if (current.length >= 3) {
      return Alert.alert('Limit Reached', 'You can only compare up to 3 vehicles.');
    }
    set({ vehicles: [...current, vehicle] });
  },

  removeVehicle: (id: string) => {
    set(state => ({ vehicles: state.vehicles.filter(v => v.id !== id) }));
  },

  clearVehicles: () => {
    set({ vehicles: [] });
  }
}));
