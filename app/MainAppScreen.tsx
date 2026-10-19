import { Alert, Image, Text, View, StyleSheet, StatusBar, ToastAndroid, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../app/services/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Index from './index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@rneui/themed';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { startNetworkListener } from "../app/services/networkListener";
import { safeFetch } from '../app/services/apiClient';

SystemNavigationBar.fullScreen(true);

library.add(fas)

type MyButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function MainAppScreen() {

  const MyButtonReturn = ({ title, onPress }: MyButtonProps) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.btn2}>
        <Text style={styles.buttonText2}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalContainer: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

    image: {
      top: 50,
      width: '95%',
      height: undefined,
      aspectRatio: 4.25,
      marginBottom: 100,
      resizeMode: 'stretch',
    },

    container: {
      flex: 1,
      backgroundColor: '#ffff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    form: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      margin: 10,
      gap: 20,
      borderRadius: 5
    },

    title: {
      fontSize: 25,
      fontWeight: 900,
      top: -25,
      color: '#005E35',
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

    btn2: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      top: 20,
      left: -165,
      zIndex: 10,
      alignItems: 'center'
    },

    dropdown: {
      fontSize: 20,
      width: '95%',
      zIndex: 3,
    },

    input: {
      color: "rgba(99, 97, 97, 1)",
      width: 225,
      margin: 5,
      marginBottom: 15,
      borderWidth: 1,
      borderRadius: 2
    },

    input2: {
      color: "rgba(99, 97, 97, 1)",
      width: 225,
      margin: 5,
      marginBottom: 15,
      borderWidth: 0.75,
      borderRadius: 2
    },

    obs: {
      fontSize: 12, 
      color: 'rgba(139, 139, 139, 0.53)', 
      marginTop: -5, 
      marginBottom: 10,
      textAlign: 'center'
    },

    text: {
      fontSize: 20,
      padding: 0,
      color: "rgba(99, 97, 97, 1)",
      alignItems: "center",
      marginBottom: 15,
    },

    text2: {
      fontSize: 20,
      padding: 0,
      color: "rgba(99, 97, 97, 1)",
      alignItems: "center"
    },

    listBox: {
      width: 225,
      borderColor: "rgba(99, 97, 97, 1)",
      borderRadius: 2,
      color: "white",
      marginTop: 5
    },

    listBoxUn: {
      width: 275,
      borderColor: "rgba(99, 97, 97, 1)",
      borderRadius: 0,
      color: "rgba(99, 97, 97, 1)",
    },

    listInput2: {
      color: "rgba(99, 97, 97, 1)",
    },

    buttonText: {
      color: '#005E35'
    },

    buttonText2: {
      color: '#005E35',
      fontSize: 18
    },
  });

  async function handleLogout() {
    await signOut(auth);
    await AsyncStorage.removeItem('@usuario');
    setSignOut(true);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setPosto(snapshot.data().posto);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    startNetworkListener();
  }, []);

  const [posto, setPosto] = useState<string | null>(null);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
  const [handleSignOut, setSignOut] = useState(false);
  const reqID = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
  const data = new Date().toLocaleString('pt-BR');

  const handleSubmit = async (nvl: string) => {
    ToastAndroid.show('Enviando E-mail...', ToastAndroid.SHORT);

    if (!posto) {
      Alert.alert('Erro', 'Posto não encontrado no cadastro.');
      return;
    }

    const payload = {posto, nvl: nvl, data, reqID};
    // console.log(payload);

    try {
      let response = await safeFetch('https://ams-backend-server.onrender.com/api/ams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (result.code == 200) {
        setStatus({
          success: true,
          message: 'Enviado com Sucesso!',
        });
        console.log('✅ E-mail Enviado!');
        ToastAndroid.show('E-mail Enviado! ✅', ToastAndroid.SHORT);
      } else {
        throw new Error(result.message || 'Falha no envio');
      }
    } catch (error) {
      if (Error("Sem conexão. Requisição armazenada.")){
        ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
      } else {
        setStatus({
          success: false,
          message: 'Erro no Envio!',
        });
        ToastAndroid.show(`Erro ao Enviar! ❌ ${error}`, ToastAndroid.SHORT);
      }
    }
  }
  
  if (handleSignOut) return <Index />;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffff', alignItems: 'center',}}>
      {/* TOP SYMBOL */}
      <Image
        style={{
          top: 0,
          width: '101%',
          height: undefined,
          aspectRatio: 10,
        }}
        source={require('./assets/SJM-TOP-SYMBOL.png')}
      />

      <MyButtonReturn
        title={'◀ Voltar'}
        onPress={handleLogout}
      />

      {/* SJM LOGO */}
      <Image
        style={styles.image}
        source={require('./assets/SJM-SECRETARIA.png')}
      />

      <Text style={styles.title}>
        Acesso Mais Seguro {"\n"}

        {posto ? (
          <Text style={{ fontSize: 20-2, fontWeight: 'normal', marginTop: 10, color: '#005E35'   }}>📍 {posto}</Text>
        ) : (
          <Text style={{ fontSize: 15-1, fontWeight: 'normal', marginTop: 10, color: '#61616194' }}>Carregando posto...</Text>
        )}
      </Text>

      {/* TOP BUTTONS */}
      <View style={styles.form}>
        {/* GREEN BUTTON */}
        <Button
          radius={'lg'}
          type="solid"
          title=""
          titleStyle={{ fontSize: 10, color: '#ffffff' }}
          buttonStyle={{
            backgroundColor: '#005E35',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🟢')}
        >
          <FontAwesomeIcon icon="check" size={50} color='white'/>
        </Button>

        {/* YELLOW BUTTON */}
        <Button
          radius={'lg'}
          type="solid"
          title=""
          titleStyle={{ fontSize: 10, color: '#ffffff' }}
          buttonStyle={{
            backgroundColor: '#fdc706',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🟡')}
        >
          <FontAwesomeIcon icon="house-medical-circle-exclamation" size={50} color='white'/>
        </Button>
      </View>
      
      {/* BOTTOM BUTTONS */}
      <View style={styles.form}>
        {/* ORANGE BUTTON */}
        <Button
          radius={'lg'}
          type="solid"
          title=""
          titleStyle={{ fontSize: 50, color: 'transparent' }}
          buttonStyle={{
            backgroundColor: '#FD8606',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🟠')}
        >
          <FontAwesomeIcon icon="exclamation" size={50} color='white'/>
        </Button>

        {/* RED BUTTON */}
        <Button
          radius={'lg'}
          type="solid"
          title=""
          titleStyle={{ fontSize: 10, color: '#ffffff' }}
          buttonStyle={{
            backgroundColor: '#FD0606',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🔴')}
        >
          <FontAwesomeIcon icon="exclamation-triangle" size={50} color='white'/>
        </Button>
      </View>

      {/* YELLOW */}
      <View
        style={{
          backgroundColor: '#FDC806',
          width: '100%',
          height: undefined,
          aspectRatio: 2,
          position: 'absolute',
          bottom: -25,
          borderRadius: 10,
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
          borderRadius: 10,
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
          borderRadius: 10,
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
          aspectRatio: 10,
        }}
        source={require('./assets/SJM-TOP-SYMBOL.png')}
      />

    <StatusBar hidden={true}/>
    </View>
  );
}
