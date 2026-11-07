# Introduction et synthèse d'installation React Native

## 1. Comprendre les outils

React décrit l'interface avec des composants, des props et de l'état. React Native applique cette logique à une interface native Android ou iOS : `View`, `Text` et `TextInput` remplacent les éléments HTML usuels. Expo apporte l'outillage du projet et le serveur de développement Metro.

Expo Go est une application mobile qui permet d'ouvrir un projet compatible sans compiler soi-même son application native. Elle contient un ensemble prédéfini de modules natifs. Un module absent de cet ensemble nécessite une compilation de développement dédiée. [Expo Go et compilations de développement](https://docs.expo.dev/develop/development-builds/introduction/).

React Navigation organise les déplacements entre les écrans à l'aide d'une pile déclarée dans `App.js`. NativeWind permet d'utiliser des classes utilitaires pour les styles React Native.

## 2. Référence de ce support

Le dépôt déclare Expo `~57.0.32`, React Native `0.86.3` et NativeWind `^4.2.7`. Les instructions visent le SDK 57 et NativeWind 4, pas NativeWind 5. [Documentation Expo 57](https://docs.expo.dev/versions/v57.0.0/).

Le dépôt utilise npm et possède `package-lock.json`, sans `bun.lock`.

État observé : React Navigation est déjà utilisé dans `App.js`. NativeWind est déclaré mais pas configuré. Les étapes ci-dessous sont des instructions à appliquer dans un projet d'exercice ; la rédaction de ce support ne migre pas l'application existante.

On utilise seulement React, React Native et Expo, le routeur et NativeWind. Les modules compagnons indispensables au fonctionnement de ces deux outils sont explicités ci-dessous ; aucune bibliothèque de formulaires, de composants UI ou de gestion d'état n'est ajoutée. Tailwind et Babel sont des outils nécessaires à la configuration de NativeWind 4.

## 3. Préparer l'environnement et Expo Go

1. Installer Node.js LTS et vérifier `node --version` et `npm --version`.
2. Installer Expo Go sur le téléphone depuis sa boutique d'applications.
3. Relier le téléphone et l'ordinateur au même réseau.
4. Lancer le serveur du projet avec `npx expo start`.
5. Ouvrir le QR code : appareil photo sur iOS, lecteur d'Expo Go sur Android.

La version d'Expo Go doit prendre en charge le SDK du projet. Si elle signale une incompatibilité, vérifier les versions avant de poursuivre. [Préparation de l'environnement](https://docs.expo.dev/get-started/set-up-your-environment/).

Pour reprendre ce dépôt, depuis sa racine :

```bash
npm ci
npx expo start
```

Cela lance l'application actuelle avec React Navigation ; cela ne configure pas NativeWind.

## 4. Initialiser un nouveau projet JavaScript

Créer un dossier distinct, sans écraser le dépôt étudié, avec le template vide `blank` :

```bash
npx create-expo-app@latest burgers-mobile --template blank
cd burgers-mobile
```

Ce template démarre avec `App.js`. Vérifier la version `expo` générée dans `package.json` : la commande `latest` évolue, elle ne garantit pas le SDK 57 utilisé par le dépôt de référence. Pour reproduire exactement l'environnement de ce dépôt, préférer sa reprise avec `npm ci` ; sinon consulter la documentation de la version générée avant de configurer NativeWind. [Création d'un projet Expo](https://docs.expo.dev/get-started/create-a-project/).

Créer cette arborescence JavaScript au fil du mini-projet :

```text
App.js
index.js
components/
  Burger.js
srceens/
  Signup.js
  Signin.js
  Home.js
  BurgerList.js
  BurgerDetails.js   # écran supplémentaire de l'exercice dynamique
data/
  burgers.js         # noms partagés avec le détail
```

Conserver l'orthographe `srceens` du dépôt dans les imports. `index.js` enregistre le composant `App`, qui contient la navigation.

## 5. Installer et configurer React Navigation

Installer la pile native et les modules compagnons via Expo :

```bash
npx expo install @react-navigation/native@^7 @react-navigation/native-stack@^7 react-native-screens react-native-safe-area-context
```

Dans ce dépôt, ces dépendances sont déjà déclarées. Les deux premiers packages fournissent la navigation ; les deux suivants sont ses modules natifs compagnons. [Installation React Navigation](https://reactnavigation.org/docs/getting-started/).

Après création des quatre écrans, déclarer la pile dans `App.js` :

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
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BurgerList" component={BurgerList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Chaque écran exporte son composant par défaut. `NavigationContainer` contient l'état de navigation ; `Stack.Navigator` organise la pile ; `Stack.Screen` associe un nom à un composant. [Pile native React Navigation](https://reactnavigation.org/docs/native-stack-navigator/).

### Navigation simple et dynamique

Dans `srceens/Home.js` :

```jsx
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";

export default function Home() {
  const navigation = useNavigation();
  return (
    <Button
      title="Go to burger list"
      onPress={() => navigation.push("BurgerList")}
    />
  );
}
```

Pour ajouter le détail, importer `BurgerDetails` dans `App.js` et ajouter `<Stack.Screen name="BurgerDetails" component={BurgerDetails} />` à la pile existante. Cet écran est un complément absent du dépôt initial.

Depuis la liste, avec `navigation` obtenu via `useNavigation()` :

```js
navigation.push("BurgerDetails", { burgerName: "le chicken" });
```

Dans `srceens/BurgerDetails.js` :

```jsx
import { Text } from "react-native";

export default function BurgerDetails({ route }) {
  const burgerName = route.params?.burgerName;
  return (
    <Text>
      {typeof burgerName === "string" ? burgerName : "Burger inconnu"}
    </Text>
  );
}
```

Le nom d'écran est fixe ; le nom du burger transmis varie selon la carte choisie. Le mini-projet ajoute la vérification du nom et un bouton de retour. [Paramètres React Navigation](https://reactnavigation.org/docs/params/).

## 6. Configurer NativeWind 4

NativeWind 4.2.7 conserve la configuration Tailwind CSS 3. Avec Expo 57 et Reanimated 4, Worklets fait partie des modules compagnons à installer. Les fichiers ci-dessous suivent la [procédure NativeWind 4](https://www.nativewind.dev/docs/getting-started/installation).

### Installer les dépendances nécessaires

```bash
npx expo install nativewind@4.2.7 react-native-reanimated react-native-worklets react-native-safe-area-context
npx expo install --dev tailwindcss@^3.4.17 babel-preset-expo
```

Les versions natives sont choisies par Expo. Aucun plugin Prettier n'est nécessaire pour réaliser cet exercice.

### Créer les fichiers à la racine

`tailwind.config.js` :

```js
module.exports = {
  content: [
    "./App.js",
    "./components/**/*.{js,jsx}",
    "./srceens/**/*.{js,jsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

`global.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`babel.config.js` :

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

`metro.config.js` :

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

Importer le CSS une fois, en haut de `App.js`, avant les autres imports :

```js
import "./global.css";
```

Pour une cible Web, fusionner `"bundler": "metro"` dans `expo.web` de `app.json` et installer ses dépendances de plateforme avec `npx expo install react-dom react-native-web`. Elles ne sont pas nécessaires au parcours mobile de ce support.

### Vérifier visuellement

Après configuration :

```bash
npx expo start --clear
```

Exemple adapté de la carte `Burger` :

```jsx
import { Text, View } from "react-native";

export default function BurgerPreview() {
  return (
    <View className="w-full items-center">
      <Text className="text-[18px] text-gray-500">le chicken</Text>
    </View>
  );
}
```

La classe `text-[18px]` exprime une taille via l'outil NativeWind ; dans un objet `StyleSheet`, on écrirait `fontSize: 18`. Ne pas mélanger les deux syntaxes.

## 7. Contrôles de fin d'installation

- Le QR code ouvre l'écran d'inscription.
- `Signup`, `Signin`, `Home` et la liste sont accessibles.
- Deux noms de burger différents ouvrent le même fichier de détail avec un paramètre différent.
- Les classes de l'exemple NativeWind ont un effet visible.
- Aucun dossier natif `ios/` ou `android/` n'a été écrit manuellement.

Commandes de diagnostic :

```bash
npx expo install --check
npx expo-doctor
npx expo lint
```

Si ESLint n'est pas configuré, `expo lint` peut proposer son installation. C'est un outil de développement, distinct des bibliothèques utilisées dans les écrans. Dans le dépôt lu, ESLint est absent. Les écrans et les composants de ce parcours sont des fichiers `.js` ; les vérifications visuelles sur téléphone complètent l'analyse du code.

Le [mini-projet guidé](03-mini-projet-guide.md) détaille maintenant les écrans et les interactions.
