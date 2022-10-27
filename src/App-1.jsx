import React, { Component } from 'react'
import * as RN from 'react-native';
import { Provider, useSelector ,useDispatch } from 'react-redux';
import {store, counterActions,useAppSelector,useAppDispatch, persistor} from './redux/store';
// import { useAppSelector, useAppDispatch } from './redux/hooks'
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { unauthedPages, authedPages } from './router/routes';
// import { i18n } from "./i18n/i18n";
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './redux/AppContent';
import { PersistGate } from 'redux-persist/integration/react'
import Lottie from 'lottie-react-native';


class App extends Component {
  render(){
    const LaunchPage = () => {
      const dispatch = useAppDispatch();
      const count = useAppSelector(state => state.counter)
    
      const incrementHandler = () => {
        dispatch(counterActions.increment(5));
      };
    
      const increaseHandler = () => {
        dispatch(counterActions.increase(5)); // { type: SOME_UNIQUE_IDENTIFIER, payload: 10 }
      };
    
      const decrementHandler = () => {
        dispatch(counterActions.decrement(5));
      };
    
      const toggleCounterHandler = () => {
        dispatch(counterActions.toggleCounter(5));
      };
      return (
        <RN.View>
          <RN.Text> {count}</RN.Text>
          <RN.TouchableOpacity onPress={incrementHandler}>
            <RN.Text>Increment</RN.Text>
          </RN.TouchableOpacity>
          <RN.TouchableOpacity onPress={increaseHandler}>
            <RN.Text>Increase by 10</RN.Text>
          </RN.TouchableOpacity>
          <RN.TouchableOpacity onPress={decrementHandler}>
            <RN.Text>Decrement</RN.Text>
          </RN.TouchableOpacity>
          <RN.TouchableOpacity onPress={toggleCounterHandler}>
            <RN.Text>Toggle Counter</RN.Text>
          </RN.TouchableOpacity>
          <Lottie 
            source={require('./assets/296-react-logo.json')}   
            height={500}
            width={500} 
            autoPlay 
            loop
          />
        </RN.View>
      );
    };

    return(
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProvider>
          <LaunchPage />
        </AppProvider>
      </PersistGate>
    </Provider>
    )
  }
  
}

export default App;
