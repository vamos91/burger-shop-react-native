import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Signin() {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const userData = {
        email: "tony@stark.fr",
        password: '12345678'
    }

    const getDataFromForm = () => {
       navigation.navigate('Home')
    }

   
  return (
      <View style={styles.container}>
          <Text>Signin</Text>
         
          
          <TextInput
              style={styles.input}
              placeholder='Email'
              onChangeText={setEmail}
              value={email}
          />
          <TextInput
              style={styles.input}
              placeholder='password'
              onChangeText={setPassword}
              value={password}
          />
          <Button
            style={styles.button}
              title="Signin"
              onPress={() => getDataFromForm()}
          />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '90%',
    height: 40,
    margin: 12,
    borderWidth: 1,
        padding: 10,
    borderRadius: 10
    }
})