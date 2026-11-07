# Mini-projet guidé — burgers, likes et formulaires

## 1. Mission et fidélité au dépôt

Reconstituer progressivement l'application étudiée : inscription de démonstration, connexion de démonstration, accueil, liste de quatre burgers, compteur de likes par carte, choix d'un burger et ajout de sauces sans doublons.

Les données et libellés métier viennent du dépôt : `le chicken`, `le new yorker`, `le veggie`, `le mexican`, `ketchup`, `mayo`, `Like` et `Order now !`. Les identifiants préremplis de l'inscription restent `tony@stark.fr` et `1234`.

Deux prolongements sont explicitement ajoutés : un écran de détail avec un paramètre de route et une conversion de styles avec NativeWind. Ils ne sont pas présentés comme des fonctionnalités déjà présentes.

Le parcours reprend l'organisation du dépôt dans un **nouveau projet d'exercice** : `App.js`, `components/` et `srceens/`. La navigation utilise React Navigation 7 et tous les fichiers sont en JavaScript avec JSX. L'application d'origine n'est pas modifiée.

Préparer le projet avec le [document d'installation](02-installation-react-native.md), sections 3 à 5. NativeWind n'est nécessaire qu'à la dernière étape. Ne pas ajouter de bibliothèque de formulaire, de données ou de composants.

### Résultat attendu

```text
Signup → Signin → Home → BurgerList → BurgerDetails (paramètre burgerName)
```

```text
App.js
index.js
components/Burger.js
srceens/Home.js
srceens/Signup.js
srceens/Signin.js
srceens/BurgerList.js
srceens/BurgerDetails.js   # complément ajouté à l'exercice 8
data/burgers.js           # tableau extrait de BurgerList pour le partager
```

Le nom `srceens` conserve l'orthographe du dossier étudié. Le point d'entrée `index.js` du template enregistre `App`, comme dans le dépôt.

Pour chaque étape, essayer les consignes avant de consulter la proposition. Les blocs désignés comme fichiers complets peuvent être copiés tels quels. Les autres blocs sont des modifications localisées.

## 2. Exercice 1 — créer Home et la pile de navigation

**Objectif :** comprendre qu'un écran est un composant enregistré dans une pile.

1. Créer `srceens/Home.js` avec un texte `Home` et le bouton `Go to burger list`.
2. Dans `App.js`, importer `NavigationContainer` et `createNativeStackNavigator`.
3. Enregistrer d'abord `Home`. Ajouter les autres écrans au fil des exercices.

Fichier complet `App.js` pour démarrer :

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./srceens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Fichier complet `srceens/Home.js` :

```jsx
import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to burger list"
        onPress={() => navigation.push("BurgerList")}
      />
    </View>
  );
}
```

Tant que `BurgerList` n'est pas créé et enregistré, ne pas tester le bouton. Après l'exercice 5, importer `BurgerList` dans `App.js` et ajouter `<Stack.Screen name="BurgerList" component={BurgerList} />` à la pile.

**Vérification :** `Home` s'affiche au lancement. Identifier le composant de structure, le composant de texte et l'événement du bouton.

Différence volontaire avec `Home.js` du dépôt : ne pas recopier l'objet local `user` ni une navigation pendant le rendu. Cet exercice ne crée aucune authentification.

## 3. Exercice 2 — construire une carte et transmettre une prop

**Objectif :** réutiliser un composant avec des noms différents.

1. Créer `components/Burger.js`.
2. Accepter une prop `burgerName` contenant une chaîne de caractères.
3. Afficher le nom dans `Text` et la photo utilisée dans le dépôt avec `Image`.
4. Appliquer une largeur de 200, une hauteur de 150 et un titre gris de taille 18.

La version complète de l'exercice 3 ci-dessous inclut ces éléments. Pour un test temporaire, importer `Burger` depuis `../components/Burger` dans `Home.js`, puis ajouter cette carte dans son `View` :

```jsx
<Burger burgerName="le chicken" handleParentClick={() => {}} />
```

Le callback vide est seulement un point de départ temporaire, remplacé à l'exercice 4.

**Vérification :** changer la prop pour `le veggie` change le titre sans créer un nouveau composant. La photo distante nécessite une connexion ; ne pas confondre une image indisponible avec une prop mal transmise.

## 4. Exercice 3 — ajouter les likes et la commande

**Objectif :** associer événements, état local et callback parent.

1. Importer `useState`.
2. Initialiser `counter` à zéro.
3. Ajouter un bouton `Like` qui incrémente le compteur.
4. Ajouter `Order now !` qui appelle la prop fonction avec le nom du burger.

Fichier complet `components/Burger.js`, solution des exercices 2 et 3 :

```jsx
import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function Burger({ burgerName, handleParentClick }) {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((previousCounter) => previousCounter + 1);
  };

  const orderBurger = () => {
    handleParentClick(burgerName);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: "https://burgeraddict.fr/wp-content/uploads/2024/09/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg",
        }}
      />
      <Text style={styles.burgerTitle}>{burgerName}</Text>
      <Button title="Like" color="red" onPress={handleClick} />
      <Button title="Order now !" onPress={orderBurger} />
      <Text>{counter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center" },
  burgerTitle: { color: "gray", fontSize: 18 },
  image: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    borderRadius: 5,
  },
});
```

L'incrément fonctionnel est une amélioration de l'écriture `setCounter(counter + 1)` du dépôt. La prop `style` inutilisable sur `Button` n'est pas recopiée.

**Vérification après l'exercice 4 :** trois pressions sur `Like` affichent `3` sur cette carte et laissent les autres compteurs à zéro. Expliquer pourquoi `onPress={handleClick}` transmet une fonction tandis que `onPress={handleClick()}` l'exécuterait pendant le rendu.

## 5. Exercice 4 — générer la liste et remonter la sélection

**Objectif :** utiliser `map`, une clé stable et un état dans le parent.

Créer `data/burgers.js`, fichier complet :

```js
export const burgerList = [
  "le chicken",
  "le new yorker",
  "le veggie",
  "le mexican",
];
```

Ce sont les quatre valeurs du tableau initial de `BurgerList.js`. On les extrait pour pouvoir les réutiliser dans le détail ultérieur.

Dans `srceens/BurgerList.js` :

1. Créer l'état `burger`, initialisé à `''`.
2. Écrire `getBurger(myBurger)` pour changer cet état.
3. Utiliser `burgerList.map` pour afficher une carte par nom dans un `ScrollView`.
4. Transmettre le nom et `getBurger` à chaque carte.
5. Afficher le choix au-dessus de la liste.

Noyau de l'exercice, à intégrer au fichier complet de l'exercice 5 :

```jsx
const [burger, setBurger] = useState('');
const getBurger = (myBurger) => setBurger(myBurger);

// Dans le JSX :
<Text>Vous avez choisis: {burger}</Text>
<ScrollView style={{ flex: 1, width: '100%' }}>
  {burgerList.map((burgerName) => (
    <Burger
      key={burgerName}
      burgerName={burgerName}
      handleParentClick={getBurger}
    />
  ))}
</ScrollView>
```

Le libellé `Vous avez choisis:` conserve ici celui du dépôt. La clé est le nom, unique dans cette petite liste ; `key` aide React à identifier les éléments et n'est pas une prop métier à lire dans `Burger`.

**Vérification :** commander `le mexican` actualise le texte du parent. Commander un autre burger remplace le choix. Aucun panier ou achat n'est créé : « commander » signifie ici sélectionner un nom dans l'état local.

## 6. Exercice 5 — ajouter les sauces sans doublons

**Objectif :** mettre à jour un tableau sans le modifier directement.

1. Ajouter `sauce` avec `useState([])`.
2. Ajouter les boutons `ketchup` et `mayo`.
3. Refuser l'ajout si la sauce est déjà présente.
4. Afficher les sauces avec `join(', ')`.

Fichier complet `srceens/BurgerList.js`, solution des exercices 4 et 5 :

```jsx
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import Burger from "../components/Burger";
import { burgerList } from "../data/burgers";

export default function BurgerList() {
  const [burger, setBurger] = useState("");
  const [sauce, setSauce] = useState([]);

  const getBurger = (myBurger) => {
    setBurger(myBurger);
  };

  const getSauce = (ingredient) => {
    setSauce((previousSauces) =>
      previousSauces.includes(ingredient)
        ? previousSauces
        : [...previousSauces, ingredient],
    );
  };

  return (
    <View style={styles.container}>
      <Text>Vous avez choisis: {burger}</Text>
      <Text>Choisissez votre sauce: {sauce.join(", ")}</Text>
      <Button title="ketchup" onPress={() => getSauce("ketchup")} />
      <Button title="mayo" onPress={() => getSauce("mayo")} />
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {burgerList.map((burgerName) => (
          <Burger
            key={burgerName}
            burgerName={burgerName}
            handleParentClick={getBurger}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
```

**Vérification :** presser `ketchup`, `ketchup`, puis `mayo` produit `ketchup, mayo`. Les sauces appartiennent à la liste entière, comme dans le dépôt ; elles ne sont pas mémorisées séparément par burger. Aucun bouton de retrait n'est prévu dans le code étudié.

## 7. Exercice 6 — créer le formulaire Signup

**Objectif :** relier trois champs à l'état et afficher une erreur conditionnelle.

1. Créer `srceens/Signup.js`.
2. Créer les états `email`, `password`, `confirmPassword` et `isError`.
3. Préremplir les valeurs comme dans le dépôt.
4. Associer à chaque champ son `value` et son `onChangeText`.
5. Comparer les mots de passe lors de la pression sur `Signup`.
6. En cas d'égalité, ouvrir `Signin`. Sinon, afficher `Type same password !`.

Fichier complet `srceens/Signup.js` :

```jsx
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Signup() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("tony@stark.fr");
  const [password, setPassword] = useState("1234");
  const [confirmPassword, setConfirmPassword] = useState("1234");
  const [isError, setIsError] = useState(false);

  const getDataFromForm = () => {
    if (password === confirmPassword) {
      setIsError(false);
      navigation.navigate("Signin");
    } else {
      setIsError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      {isError && <Text>Type same password !</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        accessibilityLabel="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        accessibilityLabel="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        accessibilityLabel="Confirmation du mot de passe"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Signup" onPress={getDataFromForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  input: {
    width: "90%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
```

Adaptations signalées : les champs sont étiquetés et les mots de passe masqués ; `setIsError(false)` enlève l'ancienne erreur après une soumission valide. Les objets `userData` inutilisés ne sont pas recopiés.

**Vérification après l'exercice 7 :** saisir deux mots de passe différents affiche l'erreur ; les rendre identiques puis soumettre ouvre `Signin`. Deux mots de passe vides restent égaux : cette limite est volontairement conservée pour reproduire la comparaison du dépôt. Aucun compte n'est enregistré.

## 8. Exercice 7 — créer Signin et terminer le parcours

**Objectif :** distinguer une navigation d'une authentification.

Créer deux champs contrôlés, initialisés à `''`, puis un bouton qui ouvre `Home`. Le comportement reproduit celui de `Signin.js` : aucune comparaison d'identifiants.

Fichier complet `srceens/Signin.js` :

```jsx
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Signin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getDataFromForm = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text>Signin</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        accessibilityLabel="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        accessibilityLabel="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Signin" onPress={getDataFromForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  input: {
    width: "90%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
```

Après création des deux formulaires, remplacer `App.js` par cette configuration complète des quatre écrans du dépôt :

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "./srceens/Signup";
import Signin from "./srceens/Signin";
import Home from "./srceens/Home";
import BurgerList from "./srceens/BurgerList";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="BurgerList" component={BurgerList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

`initialRouteName` rend explicite l'écran initial. Redémarrer l'application pour tester ce point de départ si le rechargement conserve la navigation précédente.

**Vérification :** relancer le parcours depuis `Signup`, puis atteindre la liste. Constater qu'un email arbitraire permet aussi d'ouvrir `Home`. Expliquer pourquoi cela prouve l'absence de vérification d'identité, et non une connexion réussie.

## 9. Exercice 8 — ajouter une navigation dynamique

**Prolongement absent du dépôt initial.** Passer le nom d'un burger à un nouvel écran avec React Navigation. Conserver `Order now !` pour sélectionner le burger dans le parent.

1. Créer `srceens/BurgerDetails.js`.
2. Lire `route.params.burgerName` et vérifier son appartenance aux quatre noms.
3. Enregistrer `BurgerDetails` dans `App.js`.
4. Ajouter un bouton de détail sous chaque carte de `BurgerList`.
5. Prévoir un retour à la liste.

Dans `App.js`, ajouter cet import :

```jsx
import BurgerDetails from "./srceens/BurgerDetails";
```

Dans le `Stack.Navigator` existant, après les quatre écrans :

```jsx
<Stack.Screen name="BurgerDetails" component={BurgerDetails} />
```

Dans `srceens/BurgerList.js`, ajouter l'import :

```jsx
import { useNavigation } from "@react-navigation/native";
```

Au début de la fonction `BurgerList`, avant les états :

```js
const navigation = useNavigation();
```

Remplacer uniquement le bloc `burgerList.map` par :

```jsx
{
  burgerList.map((burgerName) => (
    <View key={burgerName}>
      <Burger burgerName={burgerName} handleParentClick={getBurger} />
      <Button
        title={`Voir ${burgerName}`}
        onPress={() => navigation.push("BurgerDetails", { burgerName })}
      />
    </View>
  ));
}
```

Fichier complet `srceens/BurgerDetails.js` :

```jsx
import { Button, Text, View } from "react-native";
import { burgerList } from "../data/burgers";

export default function BurgerDetails({ route, navigation }) {
  const burgerName = route.params?.burgerName;
  const exists =
    typeof burgerName === "string" && burgerList.includes(burgerName);

  const returnToList = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace("BurgerList");
    }
  };

  return (
    <View>
      <Text>{exists ? burgerName : "Burger inconnu"}</Text>
      <Button title="Retour à la liste" onPress={returnToList} />
    </View>
  );
}
```

React Navigation transmet les props `route` et `navigation` à l'écran enregistré. Le nom de destination est fixe (`BurgerDetails`), tandis que la valeur de `burgerName` change à chaque pression. Aucun prix, ingrédient ou identifiant produit absent du dépôt n'est inventé.

**Vérification :** ouvrir `le chicken`, revenir, puis ouvrir `le veggie` : le même composant affiche des noms différents. Pour tester un paramètre invalide, remplacer temporairement l'objet envoyé par `{ burgerName: 'inconnu' }`, constater `Burger inconnu`, puis restaurer `{ burgerName }`. Sans paramètre, le message est également `Burger inconnu`.

Le retour dépile le détail et retrouve la liste précédente avec son état. Le parcours habituel crée cet historique ; le cas de secours remplace le détail par la liste si aucun retour n'est possible. [Paramètres React Navigation](https://reactnavigation.org/docs/params/).

## 10. Exercice 9 — retrouver les styles avec NativeWind

**Prolongement de mise en forme.** Configurer NativeWind 4 avec le document 02, puis importer `./global.css` en haut de `App.js`.

1. Dans `Burger.js`, remplacer le style du conteneur par `className="w-full items-center"`.
2. Remplacer le style du titre par `className="text-[18px] text-[gray]"`.
3. Remplacer le style de l'image par `className="w-[200px] h-[150px] rounded-[5px]"` et ajouter `resizeMode="contain"`.
4. Enlever `StyleSheet` de l'import et supprimer l'objet `styles` devenu inutilisé.
5. Conserver les états, les props, les boutons et les événements.

Le JSX concerné devient :

```jsx
<View className="w-full items-center">
  <Image
    className="w-[200px] h-[150px] rounded-[5px]"
    resizeMode="contain"
    source={{
      uri: "https://burgeraddict.fr/wp-content/uploads/2024/09/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg",
    }}
  />
  <Text className="text-[18px] text-[gray]">{burgerName}</Text>
  <Button title="Like" color="red" onPress={handleClick} />
  <Button title="Order now !" onPress={orderBurger} />
  <Text>{counter}</Text>
</View>
```

Pour les champs de formulaire, la conversion proposée est :

```jsx
className =
  "w-[90%] h-[40px] m-[12px] border border-black p-[10px] rounded-[10px]";
```

La bordure noire est explicitée dans cette adaptation. Le conteneur centré peut devenir `className="flex-1 items-center justify-center"`. Supprimer seulement les styles qui ne sont plus référencés.

**Vérification :** redémarrer avec `npx expo start --clear`. Les dimensions restent cohérentes et les boutons fonctionnent encore. Si les classes n'ont aucun effet, contrôler les chemins `content`, l'import CSS, les configurations Babel et Metro avant de modifier la logique. [Installation NativeWind 4](https://www.nativewind.dev/docs/getting-started/installation).

## 11. Recette finale et questions

| Action                                  | Résultat attendu                                         |
| --------------------------------------- | -------------------------------------------------------- |
| Ouvrir le projet                        | `Signup`, email prérempli, deux mots de passe identiques |
| Soumettre des mots de passe différents  | Message `Type same password !`                           |
| Soumettre des mots de passe identiques  | Ouverture de `Signin`                                    |
| Presser `Signin`, même champs vides     | Ouverture de `Home`, conforme à la démonstration         |
| Presser `Go to burger list`             | Quatre cartes avec les noms du dépôt                     |
| Presser deux fois `Like` sur le chicken | Compteur `2` sur cette carte                             |
| Presser `Order now !` sur le veggie     | Choix affiché : `le veggie`                              |
| Presser deux fois ketchup, puis mayo    | `ketchup, mayo`, sans doublon                            |
| Ouvrir deux détails différents          | Le paramètre change le texte du même écran               |
| Convertir la carte avec NativeWind      | Même logique, styles appliqués avec `className`          |

Lancer les contrôles dans le projet d'exercice :

```bash
npx expo lint
```
