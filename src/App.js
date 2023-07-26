import * as React from 'react';
import {Provider} from 'react-redux';
import {store, persistor, useAppSelector} from './redux/store';
import {AppProvider, AppContext} from './redux/AppContent';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {authedPages, unAuthedPages} from './router/routes';

const Stack = createNativeStackNavigator();

const UnAuthedPages = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="sign"
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}>
        {unAuthedPages.map(item => (
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
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}>
        {authedPages.map(item => (
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
  const appCtx = React.useContext(AppContext);
  const [checklogin, setCheckLogin] = React.useState(false);
  const reduxToken = useAppSelector(state => state.token);
  const reduxAccount = useAppSelector(state => state.account);

  const init = async () => {
    // 登入 token判斷
    if (
      !['', null, undefined].includes(reduxToken) &&
      !['', null, undefined].includes(reduxAccount)
    ) {
      setCheckLogin(true);
    } else {
      setCheckLogin(false);
    }
  };

  React.useEffect(() => {
    if (appCtx.initialized) {
      setTimeout(init, 500);
    }
  });

  return checklogin ? <AuthedPage /> : <UnAuthedPages />;
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
};

export default App;
