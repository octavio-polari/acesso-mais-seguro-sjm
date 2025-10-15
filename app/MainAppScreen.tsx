import { Alert, Image, Text, View, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import { Button } from 'react-native-elements';
import { auth, db } from './FirebaseConfig.ts';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Index from './index.tsx';

export default function MainAppScreen() {
  async function handleLogout() {
    await signOut(auth);
    await AsyncStorage.removeItem('@usuario');
    setSignOut(true);
  }

  useEffect(() => {
    async function loadUserPosto() {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const docRef = doc(db, 'usuarios', user.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPosto(data.posto);
          console.log('🏥 Posto do usuário:', data.posto);
        } else {
          console.warn('Usuário sem posto definido no Firestore.');
        }
      } catch (err) {
        console.log('Erro ao buscar posto:', err);
      }
    }
    loadUserPosto();
  }, []);

  const [posto, setPosto] = useState<string | null>(null);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
  const [handleSignOut, setSignOut] = useState(false);

  const handleSubmit = async (nvl: string) => {
    if (!posto) {
      Alert.alert('Erro', 'Posto não encontrado no cadastro.');
      return;
    }

    const payload = {posto, nvl: nvl};

    console.log(payload);

    try {
      let response = await fetch('https://ams-backend-server.onrender.com/api/ams', {
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
      } else {
        throw new Error(result.message || 'Falha no envio');
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Erro no Envio!',
      });
      console.log('❌ Erro ao Enviar → ' + error);
      // setDados({});
      // setSelected(null);
      // setDropdownKey(prev => prev + 1);
    }
  };

  // const data = [
  //   { key: '1', value: 'USF Vila São José' },
  //   { key: '2', value: 'USF Vila Norma' },
  //   { key: '3', value: 'USF Posto Alegre' },
  //   { key: '4', value: 'USF Gato Preto' },
  //   { key: '5', value: 'USF Parque Araruama' },
  //   { key: '6', value: 'USF Morro das Pedras' },
  //   { key: '7', value: 'USF Sarapuí' },
  //   { key: '8', value: 'USF Vila Rosalí' },
  //   { key: '9', value: 'USF Vila Jurandir' },
  //   { key: '10', value: 'USF Vila Tiradentes' },
  //   { key: '11', value: 'USF Coelhão' },
  //   { key: '12', value: 'USF Coelhinho' },
  //   { key: '13', value: 'USF Tibagi' },
  //   { key: '14', value: 'USF Tucão' },
  //   { key: '15', value: 'USF Parque Novo Rio' },
  //   { key: '16', value: 'UBS José Bonifácio' },
  //   { key: '17', value: 'UBS Guarani' },
  //   { key: '18', value: 'Mini Posto Parque Alian' },
  //   { key: '19', value: 'PMS Vila União' },
  //   { key: '20', value: 'PMS Vila São João' },
  // ];

  if (handleSignOut) return <Index />;

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
          aspectRatio: 10,
        }}
        source={require('./assets/SJM-TOP-SYMBOL.png')}
      />

      {/* SJM LOGO */}
      <Image
        style={styles.image}
        source={require('./assets/SJM-SECRETARIA.png')}
      />

      <View style={styles.btn2}>
        <Button
          title={'<'}
          titleStyle={{ fontSize: 50, color: 'black' }}
          buttonStyle={{
            backgroundColor: '#00000002',
            width: 90,
            height: 90,
            marginTop: 95,
            // position: 'absolute'
          }}
          onPress={handleLogout}
        />
      </View>

      <Text style={styles.titleAMS}> Acesso Mais Seguro </Text>

      {posto ? (
        <Text style={{ fontSize: 20, marginTop: 10, color: '#005E35'   }}>📍 {posto}</Text>
      ) : (
        <Text style={{ fontSize: 15, marginTop: 10, color: '#61616194' }}>Carregando posto...</Text>
      )}

      {/* BUTTONS */}
      <View style={styles.btn}>
        {/* GREEN BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: 'transparent' }}
          buttonStyle={{
            backgroundColor: '#005E35',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🟢')}
        />

        {/* YELLOW BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: 'transparent' }}
          buttonStyle={{
            backgroundColor: '#FDC806',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🟡')}
        />
      </View>

      <View style={styles.btn}>
        {/* ORANGE BUTTON */}
        <Button
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
        />

        {/* RED BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: 'transparent' }}
          buttonStyle={{
            backgroundColor: '#FD0606',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069',
          }}
          onPress={() => handleSubmit('🔴')}
        />
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

      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 20,
    width: '95%',
    height: undefined,
    aspectRatio: 4.25,
    margin: 30,
    resizeMode: 'stretch',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleAMS: {
    fontSize: 25,
    fontWeight: 900,
    position: 'absolute',
    top: 220,
    color: '#005E35',
  },

  btn: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 45,
    backgroundColor: 'transparent',
  },

  btn2: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 45,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: -25,
    left: -10,
    zIndex: 3,
  },

  dropdown: {
    fontSize: 20,
    width: '95%',
    position: 'absolute',
    top: 275,
    zIndex: 3,
  },
});
