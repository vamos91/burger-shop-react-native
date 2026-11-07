# Cours React Native — comprendre le projet de burgers

## 1. Point de départ et objectifs

À la fin du cours, vous saurez composer une interface native, transmettre des props, gérer un état et des événements, saisir un formulaire, appliquer des styles et comprendre une navigation paramétrée.

### Carte du code existant

```text
index.js                 → enregistre App avec registerRootComponent
App.js                   → déclare la pile React Navigation
components/Burger.js      → carte de burger, likes, commande
srceens/Signup.js         → formulaire d'inscription de démonstration
srceens/Signin.js         → formulaire de connexion de démonstration
srceens/Home.js           → accueil et accès à la liste
srceens/BurgerList.js     → burgers, sélection et sauces
```

Le dossier se nomme bien `srceens`, avec cette orthographe dans le dépôt.

Le parcours initial est `Signup → Signin → Home → BurgerList`. `Signup` est le premier écran déclaré dans `App.js`.

## 2. Les composants

Un composant React est une fonction qui décrit une partie de l'interface avec du JSX. Son nom commence par une majuscule. React Native utilise les mêmes mécanismes React que le Web, mais les éléments rendus sont des composants natifs.

Extrait simplifié de `components/Burger.js` :

```jsx
import { Text, View } from "react-native";

const Burger = (props) => {
  return (
    <View>
      <Text>{props.burgerName}</Text>
    </View>
  );
};

export default Burger;
```

`View` regroupe les éléments ; `Text` affiche le nom. Les accolades permettent d'insérer une expression JavaScript dans le JSX. L'export permet d'importer ce composant ailleurs :

```jsx
import Burger from "../components/Burger";

<Burger burgerName="le chicken" />;
```

Un écran est lui aussi un composant. `BurgerList` compose plusieurs cartes `Burger`, alors que chaque carte compose des primitives `View`, `Text`, `Image` et `Button`.

## 3. Du React Web à React Native

React fournit la logique des composants, des props et de l'état. React DOM fournit les éléments HTML sur le Web ; React Native fournit les primitives natives. Il n'existe pas de conversion automatique de toutes les balises HTML.

| Intention en React Web               | React Native                                           | Exemple du dépôt           |
| ------------------------------------ | ------------------------------------------------------ | -------------------------- |
| Regrouper avec `<div>`               | `<View>`                                               | Conteneur de `Burger`      |
| Afficher un `<p>`, `<span>` ou titre | `<Text>` avec un style adapté                          | Nom du burger              |
| Afficher `<img src="…">`             | `<Image source={{ uri: '…' }}>`                        | Photo dans `Burger`        |
| Saisir avec `<input>`                | `<TextInput>`                                          | Email et mots de passe     |
| Déclencher avec `<button onClick>`   | `<Button title="…" onPress>`                           | Bouton `Like`              |
| Faire défiler un conteneur           | `<ScrollView>`                                         | Liste des quatre burgers   |
| Soumettre un `<form>`                | Composants de saisie et fonction appelée par un bouton | `getDataFromForm`          |
| Naviguer avec un lien                | API du routeur ; `Link` avec Expo Router               | Complément de la section 9 |

Exemple comparatif adapté du champ email :

```jsx
// React Web : e.target.value contient le texte.
<input value={email} onChange={(e) => setEmail(e.target.value)} />

// React Native : onChangeText reçoit directement la chaîne.
<TextInput value={email} onChangeText={setEmail} />
```

Le texte visible se place dans `Text`, pas directement dans `View`. Un `Button` natif reçoit son libellé avec `title`, contrairement au bouton HTML qui contient du texte enfant. [Référence des composants React Native 0.86](https://reactnative.dev/docs/0.86/components-and-apis).

## 4. Les props : faire circuler les données

Une prop est une donnée reçue du parent. Le composant enfant la lit sans la modifier. Elle peut être une chaîne, un nombre, un tableau ou une fonction.

Dans `srceens/BurgerList.js`, le parent transmet deux props :

```jsx
<Burger burgerName={burger} handleParentClick={getBurger} />
```

| Prop                | Contenu                        | Utilisation dans l'enfant         |
| ------------------- | ------------------------------ | --------------------------------- |
| `burgerName`        | Nom du burger de l'itération   | Affichage et argument de commande |
| `handleParentClick` | Fonction `getBurger` du parent | Notification de la sélection      |

Dans `components/Burger.js`, extrait existant :

```jsx
const orderBurger = () => {
  props.handleParentClick(props.burgerName);
};
```

Dans le parent :

```jsx
const [burger, setBurger] = useState("");

const getBurger = (myBurger) => {
  setBurger(myBurger);
};
```

Le clic appelle `orderBurger`, qui appelle la fonction reçue avec le nom courant. Le parent met ensuite son état à jour et affiche la sélection. L'enfant ne modifie pas directement l'état du parent : il appelle le callback fourni.

Une déstructuration serait une écriture équivalente, proposée pour la lisibilité :

```jsx
function Burger({ burgerName, handleParentClick }) {
  return (
    <Button title="Order now !" onPress={() => handleParentClick(burgerName)} />
  );
}
```

## 5. Les variables d'état

Une variable d'état conserve une valeur entre les rendus. Son setter demande à React de recalculer l'interface. Une variable locale ordinaire ne remplit pas ce rôle.

Extrait existant de `Burger.js` :

```jsx
const [counter, setCounter] = useState(0);

const handleClick = () => {
  setCounter(counter + 1);
};
```

`counter` est la valeur du rendu courant ; `setCounter` programme sa prochaine valeur. Chaque instance de `Burger` possède son propre compteur : aimer `le chicken` ne modifie pas `le veggie`.

Lorsque la prochaine valeur dépend de la précédente, on peut écrire cette amélioration :

```jsx
setCounter((previousCounter) => previousCounter + 1);
```

Ne pas écrire `counter++` pour mettre à jour l'interface. De même, le setter ne change pas immédiatement la variable déjà capturée dans le gestionnaire courant.

### État texte, booléen et tableau

Exemples présents dans les écrans :

```jsx
const [email, setEmail] = useState("tony@stark.fr");
const [isError, setIsError] = useState(false);
const [sauce, setSauce] = useState([]);
```

Dans `BurgerList.js`, une sauce ne peut être ajoutée qu'une fois :

```jsx
const getSauce = (ingredient) => {
  if (!sauce.includes(ingredient)) {
    setSauce([...sauce, ingredient]);
  }
};
```

`includes` vérifie la présence ; `...sauce` copie les éléments dans un nouveau tableau. On ne modifie pas l'ancien avec `push`. L'expression `sauce.join(', ')` fabrique la chaîne affichée.

Amélioration fonctionnelle possible :

```jsx
setSauce((previousSauces) =>
  previousSauces.includes(ingredient)
    ? previousSauces
    : [...previousSauces, ingredient],
);
```

Les états présentés restent en mémoire. Ils ne constituent ni une base de données ni une sauvegarde après fermeture de l'application.

## 6. Les événements

Un événement correspond à une interaction : pression sur un bouton, changement d'un champ. Le gestionnaire est une fonction transmise au composant.

Exemples du projet :

```jsx
<Button title="Like" onPress={() => handleClick()} />
<Button title="ketchup" onPress={() => getSauce('ketchup')} />
<TextInput value={email} onChangeText={setEmail} />
```

`onPress={handleClick}` convient également si aucun argument métier n'est nécessaire. En revanche, `onPress={handleClick()}` appellerait la fonction pendant le rendu. Pour transmettre `'ketchup'` au moment de la pression, on utilise une fonction fléchée.

Le nom `handleClick` dans le dépôt est un nom de fonction libre ; l'événement natif reste `onPress`. Le `Button` possède peu d'options de personnalisation et `color` peut avoir un rendu différent selon la plateforme. [API Button 0.86](https://reactnative.dev/docs/0.86/button).

## 7. Les formulaires contrôlés

Un champ contrôlé associe sa valeur affichée à l'état React : `value` lit l'état, `onChangeText` l'actualise. Il n'y a pas de balise HTML `form` dans ces écrans.

Extrait existant de `Signup.js` :

```jsx
const [email, setEmail] = useState("tony@stark.fr");
const [password, setPassword] = useState("1234");
const [confirmPassword, setConfirmPassword] = useState("1234");
const [isError, setIsError] = useState(false);

const getDataFromForm = () => {
  if (password === confirmPassword) {
    navigation.navigate("Signin");
  } else {
    setIsError(true);
  }
};
```

Puis dans le JSX :

```jsx
{isError && <Text>Type same password !</Text>}

<TextInput
  style={styles.input}
  placeholder="Email"
  onChangeText={setEmail}
  value={email}
/>

<Button title="Signup" onPress={() => getDataFromForm()} />
```

Le rendu conditionnel `isError && …` affiche le message uniquement si le booléen est vrai.

### Ce que fait réellement le dépôt

- `Signup` compare seulement les deux mots de passe ; deux chaînes vides seraient donc égales.
- L'email n'est pas validé et aucun compte n'est créé.
- `Signin` ouvre `Home` sans comparer les champs à `userData`.
- Les objets `userData` déclarés dans les formulaires ne sont pas utilisés.
- Le message d'erreur de `Signup` n'est pas remis à `false` lors d'une correction.
- Les champs de mot de passe ne sont pas masqués.

Amélioration d'ergonomie proposée, sans bibliothèque de formulaire :

```jsx
<TextInput
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
  accessibilityLabel="Email"
/>
<TextInput
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  accessibilityLabel="Mot de passe"
/>
```

`secureTextEntry` masque l'affichage ; cela ne crée pas une authentification sécurisée. [API TextInput 0.86](https://reactnative.dev/docs/0.86/textinput).

## 8. La gestion des styles : l'équivalent du CSS

Le code actuel utilise `StyleSheet.create` et des objets JavaScript. NativeWind est une dépendance déclarée, mais aucun `className`, fichier CSS global ou configuration NativeWind n'est présent dans le code lu.

Extrait de `Signup.js` :

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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

On applique un style avec `<View style={styles.container}>`.

| Écriture Web       | Écriture React Native                       |
| ------------------ | ------------------------------------------- |
| `background-color` | `backgroundColor`                           |
| `font-size: 18px`  | `fontSize: 18`                              |
| `width: 90%`       | `width: '90%'`                              |
| `.input { … }`     | `input: { … }`, puis `style={styles.input}` |

Les nombres représentent des unités logiques indépendantes de la densité, pas des chaînes en `px`. Les styles ne suivent pas la cascade générale du CSS Web. Le texte se stylise sur `Text`. Pour combiner des styles, un tableau est possible ; la dernière valeur l'emporte en cas de conflit :

```jsx
<Text style={[styles.burgerTitle, { color: "red" }]}>le chicken</Text>
```

Cette combinaison est un exemple pédagogique ajouté. [Styles React Native 0.86](https://reactnative.dev/docs/0.86/style).

### Flexbox et dimensions

Les enfants d'un conteneur sont disposés en colonne par défaut. Avec cette direction, `justifyContent` agit sur l'axe vertical et `alignItems` sur l'axe horizontal. `flex: 1` utilise l'espace disponible dans le parent.

Dans `BurgerList`, le `ScrollView` occupe la place restante :

```jsx
<ScrollView style={{ flex: 1, width: "100%" }}>
  {/* cartes de burgers */}
</ScrollView>
```

Il rend ses enfants ensemble ; pour les quatre burgers de cet exercice, on conserve cette solution. Une grande liste demanderait une autre stratégie de rendu.

### Image distante

`Burger.js` utilise `source={{ uri: '…' }}` avec une URL HTTPS et fixe `width: 200`, `height: 150`, `resizeMode: 'contain'`, `borderRadius: 5`. L'image dépend du réseau et de la disponibilité du site distant ; le nom et les boutons restent des éléments indépendants.

### Particularité du bouton

Le dépôt contient `style={styles.button}` sur certains `Button`, alors que `styles.button` n'est pas défini. `Button` n'expose pas une prop `style` générale pour sa mise en forme. Pour espacer le bouton sans changer de bibliothèque :

```jsx
<View style={{ marginTop: 12 }}>
  <Button title="Signup" onPress={getDataFromForm} />
</View>
```

## 9. Navigation et routes dynamiques

### Lire la navigation existante : React Navigation

Dans `App.js`, extrait existant :

```jsx
const Stack = createNativeStackNavigator();

<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="BurgerList" component={BurgerList} />
  </Stack.Navigator>
</NavigationContainer>;
```

Un écran s'enregistre avec un nom et un composant. Dans `Home`, `useNavigation()` donne accès au navigateur, puis `navigation.push('BurgerList')` empile un écran. `navigation.navigate('Signin')` demande une navigation vers l'écran nommé ; `push` sert explicitement à ajouter une entrée à la pile.

Le projet utilise la configuration JSX dite « dynamique » de React Navigation. Cela ne signifie pas qu'il transmet déjà des paramètres : aucun paramètre de route n'est utilisé ici. React Navigation permettrait de transmettre un objet sérialisable puis de le lire dans `route.params`. [Paramètres React Navigation](https://reactnavigation.org/docs/params/).

`Home.js` contient aussi un objet local `user = { token: true, admin: false }`. La condition `!user.token` est donc fausse. Ce n'est pas une session connectée. Déclencher une navigation pendant le rendu, comme dans cette condition existante, n'est pas un modèle à reproduire.

### Complément demandé : une route dynamique avec Expo Router

Les consignes du dépôt demandent Expo Router pour les nouveaux exemples de navigation. Il fournit un routage par fichiers au-dessus de React Navigation. La configuration ci-dessous est un prolongement pédagogique, absent du dépôt actuel ; son installation est détaillée dans le [document 02](02-installation-react-native.md).

```text
src/app/_layout.tsx      → pile d'écrans
src/app/index.tsx        → inscription, chemin /
src/app/signin.tsx       → connexion, chemin /signin
src/app/home.tsx         → accueil, chemin /home
src/app/burgers/index.tsx
src/app/burgers/[name].tsx
```

`[name]` représente une partie variable du chemin. Les quatre noms du projet peuvent alimenter le même écran. [Notation des routes Expo Router](https://docs.expo.dev/router/basics/notation/).

Layout minimal :

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

Depuis la liste, exemple ajouté avec une valeur provenant du burger courant :

```tsx
import { router } from "expo-router";

router.push({
  pathname: "/burgers/[name]",
  params: { name: "le chicken" },
});
```

Dans `src/app/burgers/[name].tsx` :

```tsx
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function BurgerDetails() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return <Text>{name}</Text>;
}
```

On peut aussi proposer un lien :

```tsx
import { Link } from "expo-router";

<Link href={{ pathname: "/burgers/[name]", params: { name: "le veggie" } }}>
  Voir le veggie
</Link>;
```

Les props transmettent des données entre composants ; les paramètres de route décrivent la destination. On transmet ici un nom, pas un callback ni un mot de passe. [Paramètres Expo Router](https://docs.expo.dev/router/reference/url-parameters/).

## 10. Vérifier sa compréhension

1. Pourquoi chaque carte garde-t-elle un compteur différent ? Chaque instance appelle son propre `useState`.
2. Qui conserve le burger choisi ? `BurgerList`, qui reçoit le nom via le callback.
3. Pourquoi deux pressions sur `ketchup` n'affichent-elles qu'une sauce ? `includes` évite les doublons.
4. Pourquoi les champs se mettent-ils à jour ? `onChangeText` appelle le setter utilisé par `value`.
5. Le bouton `Signin` vérifie-t-il les identifiants ? Non, le code navigue directement.
6. Que représente `[name]` ? Un segment variable du chemin, introduit dans le complément Expo Router.

Pour pratiquer, suivre le [mini-projet guidé](03-mini-projet-guide.md). La référence SDK consultée est [Expo 57](https://docs.expo.dev/versions/v57.0.0/).
