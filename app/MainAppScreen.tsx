import { Image, Text, View, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import { Button } from 'react-native-elements';
import { auth } from "./FirebaseConfig.ts";
import { signOut } from "firebase/auth";
import { useState } from 'react';

export default function MainAppScreen() { 

  async function handleLogout() {
    await signOut(auth);
    await AsyncStorage.removeItem('@usuario');
  }
  
  const [dados, setDados] = useState({});
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
  const [dropdownKey, setDropdownKey] = useState(0);
  
  const infoUpdate = (cat: string, value: null) => {
    setDados({
      ...dados,
      [cat]: value,
    });
  };

  const handleSubmit = async (e: { nvl: string; }) => {
    console.log(e);
    let response = await fetch("<endpoint>/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(e),
    });
    let result = await response.json();
    if (result.code == 200) {
      setStatus({
        success: true,
        message: "Success!"
      })
      console.log("Message → "+status.message)
    } else {
      setStatus({
        success: false,
        message: "Error!"
      })
      console.log("Message → "+status.message)
    }
    setDados({});
    setSelected(null);
    setDropdownKey(prev => prev + 1);
  }

  const data = [
    { key: '1', value: 'Posto 1' },
    { key: '2', value: 'Posto 2' },
    { key: '3', value: 'Posto 3' },
    { key: '4', value: 'Posto 4' },
    { key: '5', value: 'Posto 5' },
    { key: '6', value: 'Posto 6' },
  ];

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
      <View style={styles.btn2}>
        <Button
          title={'<'}
          titleStyle={{ fontSize: 50, color: "black" }}
          buttonStyle={{
            backgroundColor: '#00000002',
            width: 90,
            height: 90,
          }}
          onPress={handleLogout}
        />
      </View>

      {/* SJM LOGO */}
      <Image
        style={styles.image}
        source={
          require('./assets/SJM-SECRETARIA.png')
        }
      />
    
      <Text style={styles.titleAMS}> Acesso Mais Seguro </Text>

      {/* DROPDOWN */}
      <View style={styles.dropdown}>
        <SelectList
          key={dropdownKey}
          setSelected={setSelected}
          data={data}
          save="value"
          onSelect={() => infoUpdate("posto", selected)}
          placeholder="Selecione o seu posto..."
          boxStyles={{ backgroundColor: 'white', borderColor: "#005E35", borderWidth: 2 }}
          dropdownStyles={{ backgroundColor: 'white', borderColor: "#005E35", borderWidth: 2 }}
          search={false}
        />
      </View>
      
      {/* BUTTONS */}
      <View style={styles.btn}>
        {/* GREEN BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: "transparent" }}
          buttonStyle={{ 
            backgroundColor: '#005E35',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069'
          }}
          onPress={async (e: any) => {
            const novosDados = { ...dados, nvl: "🟢" };
            setDados(novosDados);
            handleSubmit(novosDados);
          } }
        />
        
        {/* YELLOW BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: "transparent" }}
          buttonStyle={{ 
            backgroundColor: '#FDC806',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069'
          }}
          onPress={async (e: any) => {
              const novosDados = { ...dados, nvl: "🟡" };
              setDados(novosDados);
              handleSubmit(novosDados);
          } }
        />
      </View>

      <View style={styles.btn}>
        {/* ORANGE BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: "transparent" }}
          buttonStyle={{ 
            backgroundColor: '#FD8606',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069'
          }}
          onPress={async (e: any) => {
            const novosDados = { ...dados, nvl: "🟠" };
            setDados(novosDados);
            handleSubmit(novosDados);
          } }
        />

        {/* RED BUTTON */}
        <Button
          title=""
          titleStyle={{ fontSize: 50, color: "transparent" }}
          buttonStyle={{ 
            backgroundColor: '#FD0606',
            width: 90,
            height: 90,
            borderWidth: 2,
            borderColor: '#00000069'
          }}
          onPress={async (e: any) => {
            const novosDados = { ...dados, nvl: "🔴" };
            setDados(novosDados);
            handleSubmit(novosDados);
          } }
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

      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 75,
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
  },

  titleAMS: {
    fontSize: 25,
    fontWeight: 900,
    position: 'absolute',
    top: 220,
    color: '#005E35'
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
    zIndex: 3
  },

  dropdown: {
    fontSize: 20,
    width: '95%',
    position: 'absolute',
    top: 275,
    zIndex: 3
  },
});
