import * as React from 'react';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { AppProvider } from './redux/AppContent';
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authedPages } from './router/routes';

const Stack = createNativeStackNavigator();

const AuthedPage = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="main"
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false, 
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerStyle:{
            backgroundColor: 'transparent'
          },
        }}
      >
        {authedPages.map((item) => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={item.options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const LaunchPage = () => {
  return (
    <AuthedPage />
  );
};

const App = () => { 
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProvider>
          <LaunchPage />
        </AppProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
