import React from "react";
import * as RN from 'react-native';

const AppContext = React.createContext();

/////////////////////////////////////////////////////

const Colors = {
  default: '#000000',
  primary: '#fc9a19',
  errorText: '#bf0000',
  // input
  inputContainer: '#dedede',
  loginText: '#0571d3',
  // border
  borderColor: '#d1d1d1',

  priceComponentbgColor: '#e5e5e5'
};

/////////////////////////////////////////////////////

const LoadingView = ({ visible }) => {
  return (
    <RN.Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {}}
    >
      <RN.View style={{
        ...RN.StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <RN.View style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 30,
          borderRadius: 15,
        }}>
          <RN.ActivityIndicator color={Colors.primary} />
        </RN.View>
      </RN.View>
    </RN.Modal>
  );
};

/////////////////////////////////////////////////////

const AppProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setInitialized(true);
    RN.AppState.addEventListener('change', handleAppStateChange);
    return () => {
      RN.AppState.addEventListener('change', handleAppStateChange).remove()
    };
  }, []);


  const handleAppStateChange = async (nextAppState) => {
    console.log(nextAppState)
  };

  const value = {
    ///////////////////////
    Colors: Colors,
    loading: loading,
    setLoading: setLoading,
    initialized: initialized,
    setInitialized: setInitialized,
     ///////////////////////
  };

  return (
    <AppContext.Provider value={value}>
      <LoadingView visible={loading} />
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider};
