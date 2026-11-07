import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import Burger from '../components/Burger'
import { useState } from 'react';

function BurgerList() {
  const [burger, setBurger] = useState('')
  const [sauce, setSauce] = useState([])
  const burgerList = ['le chicken', 'le new yorker', 'le veggie', 'le mexican']

  const getBurger = (myBurger) => {
   setBurger(myBurger)
  }

  const getSauce = (ingredient) => {
    if (!sauce.includes(ingredient)) {
      setSauce([...sauce, ingredient])
    } 
  }

  return (
    <View style={styles.container}>
      <Text>Vous avez choisis: {burger}</Text>
      <Text>Choisissez votre sauce: {sauce.join(', ')}</Text>
      <Button
        title="ketchup"
        onPress={() => getSauce('ketchup')}
      />
      <Button
        title="mayo"
        onPress={() => getSauce('mayo')}
      />
      <ScrollView
        style={{ flex: 1, width: '100%' }}
      >
        {
          burgerList.map((burger) => (
            <View key={burger}>
              <Burger burgerName={burger} handleParentClick={getBurger} />
            </View>
          ))
        }
      </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default BurgerList;