import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Home() {
    const navigation = useNavigation()
    const user = { token: true, admin: false }
    
    if (!user.token) {
        navigation.navigate('Signin')
    }

  return (
    <View>
          <Text>Home</Text>
          <Button
              title="Go to burger list"
              onPress={() => navigation.push('BurgerList')}
          />
    </View>
  )
}

const styles = StyleSheet.create({})