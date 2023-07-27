import React from 'react';
import * as RN from 'react-native';

const AppContext = React.createContext();

/////////////////////////////////////////////////////

const Colors = {
  default: '#000000',
  primary: '#f5a442',
  errorText: '#bf0000',
  textPrimary: '#FFFFFF',
  // proudcut
  proudcut: {
    cardContianer: '#ffc852',
    cardTitle: '#d44b2c',
    cardTitleText: '#FFFFFF',
    cardText: '#4d4537',
  },

  proudcutFilter: {
    borderPrimary: '#4d4537',
    Text: '#4d4537',
  },

  // Coupon
  Coupon: {
    cardContianer: '#FFFFFF',
    cardTitle: '#d6572d',
    cardTitleText: '#FFFFFF',
    cardText: '#4d4537',
    borderColor: '#4d402d',
  },

  // Coupon
  Transfer: {
    cardTitle: '#f2c274',
    cardTitleText: '#453f36',
  },

  // Setting
  Setting: {
    cardTitle: '#f2c274',
    cardText: '#4d4537',
  },

  // Platform
  Platform: {
    cardTitle: '#f2c274',
    cardTitleText: '#453f36',
    isActiveText: '#d6572d',
  },

  // input
  inputContainer: '#faefe3',
  inputText: '#a0ed9a',
  // border
  borderColor: '#1b1a1c',
  registerText: '#453f36',
  platformDefault: '#959595',
  productFilterDefault: '#959595',
  // search
  BottomBackgroud: '#6a3dd4',

  // photo
  photo: {
    cardContianer: '#ffc852',
    cardBottom: '#f2c274',
  },

  // Coupon
  Permission: {
    cardContianer: '#ffc852',
    cardText: '#4d4537',
    cardTitleText: '#FFFFFF',
  },
};

/////////////////////////////////////////////////////

const LoadingView = ({visible}) => {
  return (
    <RN.Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {}}>
      <RN.View
        style={{
          ...RN.StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <RN.View
          style={{
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

const AppProvider = ({children}) => {
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    // 初始化
    setInitialized(true);
    RN.AppState.addEventListener('change', handleAppStateChange);
    return () => {
      RN.AppState.addEventListener('change', handleAppStateChange).remove();
    };
  }, []);

  const handleAppStateChange = async nextAppState => {
    console.log(nextAppState);
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

export {AppContext, AppProvider};
