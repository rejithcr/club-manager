import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook for managing AsyncStorage with automatic state synchronization
 * @param key - The storage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [storedValue, setValue, isLoading]
 */
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load value from AsyncStorage on mount
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item) as T);
        }
      } catch (error) {
        console.error(`Error loading ${key} from AsyncStorage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Function to update both state and AsyncStorage
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error saving ${key} to AsyncStorage:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoading] as const;
}
