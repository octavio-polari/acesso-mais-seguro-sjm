import { Alert, Image, Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import MainScreen from './MainAppScreen';
import React, { useState, useEffect } from 'react';
import {auth} from './services/FirebaseConfig';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ Usuário detectado pelo Firebase:", firebaseUser.uid);
        setUser(firebaseUser);
      } else {
        console.log("❌ Nenhum usuário detectado.");
        setUser(null);
      }
      
      // IMPORTANTE: Só paramos o loading APÓS o Firebase responder
      setLoading(false); 
    });

    return unsubscribe;
  }, []);

  async function signIn() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // await AsyncStorage.setItem("@usuario", JSON.stringify(user));
      // setLoading(true)

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
          placeholderTextColor="rgba(139, 139, 139, 0.53)"
          placeholder='E-mail...'
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder='Senha...'
          placeholderTextColor="rgba(139, 139, 139, 0.53)"
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
    color: "rgba(99, 97, 97, 1)",
    width: 225,
    margin: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "rgba(99, 97, 97, 1)",
  },
})
