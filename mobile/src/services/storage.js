import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch {
        return null;
    }
};

export const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch { }
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch { }
};

export const getJSON = async (key) => {
    try {
        const val = await AsyncStorage.getItem(key);
        return val ? JSON.parse(val) : null;
    } catch {
        return null;
    }
};

export const setJSON = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch { }
};
