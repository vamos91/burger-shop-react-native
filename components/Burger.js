import { useState } from 'react'
import {View, Text, StyleSheet, Image, Button} from 'react-native'

const Burger = (props) => {
    const [counter, setCounter] = useState(0)
    const handleClick = () => {
        setCounter(counter + 1)
    }

    const orderBurger = () => {
        props.handleParentClick(props.burgerName)
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{
                    uri: 'https://burgeraddict.fr/wp-content/uploads/2024/09/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg',
                    }}
            />
            <Text style={styles.burgerTitle}>{props.burgerName}</Text>
            <Button
                style={styles.button}
                title="Like"
                color="red"
                onPress={() => handleClick()}
            />
            <Button
                title="Order now !"
                onPress={() => orderBurger()}
            />
            <Text>{counter}</Text>
       </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    burgerTitle: {
        color: 'gray',
        fontSize: 18
    },
    image: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 5
    }
})

export default Burger;