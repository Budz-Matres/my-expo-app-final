import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Profile = {
  username: string;
  email: string;
  genre: string;
};

type ProfileContextType = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from AsyncStorage on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem('userProfile');
        if (saved) {
          setProfileState(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const setProfile = async (newProfile: Profile | null) => {
    try {
      if (newProfile) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
      } else {
        await AsyncStorage.removeItem('userProfile');
      }
      setProfileState(newProfile);
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
};
