import { Alert, Image, Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import MainScreen from './MainAppScreen';
import React, { useState, useEffect } from 'react';
import {auth} from './FirebaseConfig';

type MyButtonProps = {
  title: string;
  onPress: () => void;
};

const MyButton = ({ title, onPress }: MyButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@usuario");
        if (jsonValue) {
          const userData = JSON.parse(jsonValue);
          setUser(userData);
        }
        console.log("Session Restored");
      } catch (e) {
        if (e instanceof Error) {
          Alert.alert("Failed to Restore Session:", e.message);
        } else {
          Alert.alert("Failed to Restore Session:", String(e));
        }
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // salva no AsyncStorage
        await AsyncStorage.setItem('@usuario', JSON.stringify(user));
        setUser(user);
      } else {
        // Alert.alert("Nenhum usuário ativo. Mantendo storage até novo login.");
      }
    });

    return unsubscribe;
  }, []);

  async function signIn() {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(true)

    } catch (e: any) {
      Alert.alert('Failed: ' + e.message);
    
    } finally {
      setLoading(false);
      
    } 
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <MainScreen />;
  }

  return (
    <View style={styles.container}>

        {/* TOP SYMBOL */}
        <Image
          style={{ 
            position: 'absolute', 
            top: 0, 
            resizeMode: 'cover', 
            width: '101%', 
            height: undefined, 
            aspectRatio: 10
          }}
  
          source={
            require('./assets/SJM-TOP-SYMBOL.png')
          }
        />
  
        {/* YELLOW */}
        <View
          style={{
            backgroundColor: '#FDC806',
            width: '100%',
            height: undefined,
            aspectRatio: 2,
            position: 'absolute',
            bottom: -25,
            borderRadius: 10
          }}
        />
      
        {/* GREEN */}
        <View
          style={{
            backgroundColor: '#005E35',
            width: '100%',
            height: undefined,
            aspectRatio: 2,
            position: 'absolute',
            bottom: -75,
            borderRadius: 10
          }}
        />
  
        {/* BLUE */}
        <View
          style={{
            backgroundColor: '#0000A8',
            width: '100%',
            height: undefined,
            aspectRatio: 2,
            position: 'absolute',
            bottom: -125,
            borderRadius: 10
          }}
        />
  
        {/* BOT SYMBOL */}
        <Image
          style={{ 
            position: 'absolute', 
            bottom: -10, 
            resizeMode: 'cover', 
            width: '101%', 
            height: undefined, 
            aspectRatio: 10
          }}
  
          source={
            require('./assets/SJM-TOP-SYMBOL.png')
          }
        />
  
        {/* SJM LOGO */}
        <Image
          style={styles.image}
          source={
            require('./assets/SJM-SECRETARIA.png')
          }
        />
      

        <KeyboardAvoidingView behavior='padding'>
        
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='E-mail'
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder='Senha'
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size={'small'} style={{ margin: 28 }} />
        ) : (
          <>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MyButton
                onPress={signIn}
                title={"Entrar"}
              />
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 100,
    width: '95%',
    height: undefined,
    aspectRatio: 4.25,
    margin: 30,
    resizeMode: 'stretch'
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 5
  },
  
  titleAMS: {
    fontSize: 25,
    fontWeight: 900,
    position: 'absolute',
    top: 220,
    color: '#005E35'
  },
  
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 25,
    marginTop: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderColor: '#00000069',
    borderWidth: 1,
    borderRadius: 2,
    width: 100,
    height: 50
  },

  buttonText: {
    color: '#005E35'
  },

  input: {
    color: '#000000',
    fontSize: 15,
    width: 300,
    height: 65,
    padding: 10,
    margin: 10,
    borderStyle: 'solid',
    borderColor: '#00000069',
    borderWidth: 1,
    borderRadius: 2,
  },
})
