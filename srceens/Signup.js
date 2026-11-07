import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Signup() {
    const navigation = useNavigation()
    const [email, setEmail] = useState('tony@stark.fr')
    const [password, setPassword] = useState('1234')
    const [confirmPassword, setConfirmPassword] = useState('1234')
    const [isError, setIsError] = useState(false)

    const userData = {
        email: "tony@stark.fr",
        password: '12345678'
    }

    const getDataFromForm = () => {
        if (password === confirmPassword) {
            navigation.navigate('Signin')
        } else {
            setIsError(true)
        }
    }

  return (
      <View style={styles.container}>
          <Text>Signup</Text>
          {
             isError && <Text>Type same password !</Text>
          } 
          
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
          <TextInput
              style={styles.input}
              placeholder='Confirm password'
              onChangeText={setConfirmPassword}
              value={confirmPassword}
          />
          <Button
            style={styles.button}
              title="Signup"
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