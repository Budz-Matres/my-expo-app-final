


import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');

  const handleRegister = () => {
    if (!email || !fullName || !password || !dob.day || !dob.month || !dob.year || !gender) {
      alert('Please fill out all fields');
      return;
    }

    
    router.replace('/login'); //automatically moves to tabs logic change in index prolly
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
      <View style={styles.topContent}>
        <Image
          source={require('@/assets/images/spotifyLogo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoTitle}>Spotify</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dobRow}>
          <TextInput
            placeholder="DD"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={2}
            value={dob.day}
            onChangeText={(day) => setDob({ ...dob, day })}
            style={[styles.input, styles.dobInput]}
          />
          <TextInput
            placeholder="MM"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={2}
            value={dob.month}
            onChangeText={(month) => setDob({ ...dob, month })}
            style={[styles.input, styles.dobInput]}
          />
          <TextInput
            placeholder="YY"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={4}
            value={dob.year}
            onChangeText={(year) => setDob({ ...dob, year })}
            style={[styles.input, styles.dobInput]}
          />
        </View>

        
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Male' && styles.genderSelected]}
            onPress={() => setGender('Male')}
          >
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Female' && styles.genderSelected]}
            onPress={() => setGender('Female')}
          >
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>

       
        <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

     
      <View style={styles.altLogin}>
        <Text style={styles.altText}>Sign Up With</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>f</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>G</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/login')}>
            Sign In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  logoTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  form: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 14,
  },
  dobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dobInput: {
    flex: 1,
    marginRight: 8,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#1DB954',
  },
  genderText: {
    color: 'white',
    fontWeight: 'bold',
  },

  signupButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  altLogin: {
    marginTop: 30,
    alignItems: 'center',
  },
  altText: {
    color: '#aaa',
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white',
    marginTop: 8,
  },
  loginLink: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});