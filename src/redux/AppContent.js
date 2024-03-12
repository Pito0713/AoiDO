import React from 'react';
import * as RN from 'react-native';

const AppContext = React.createContext();
import Modal from '../component/Modal';

/////////////////////////////////////////////////////

const Colors = {
  default: '#000000',
  primary: '#f5a442',
  errorText: '#bf0000',
  textPrimary: '#FFFFFF',
  // product
  product: {
    cardContainer: '#ffc852',
    cardTitle: '#d44b2c',
    cardTitleText: '#FFFFFF',
    cardText: '#4d4537',
  },

  productFilter: {
    borderPrimary: '#4d4537',
    Text: '#4d4537',
  },

  // Coupon
  Coupon: {
    cardContainer: '#FFFFFF',
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
    cardContainer: '#ffc852',
    cardBottom: '#f2c274',
  },
  // Order
  Order: {
    cardContainer: '#faefe3',
    cardText: '#4d4537',
    cardTitleText: '#FFFFFF',
  },
};

/////////////////////////////////////////////////////

const LoadingView = ({ visible }) => {
  return (
    <RN.Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => { }}>
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

const AppProvider = ({ children }) => {
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

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState({});


  const value = {
    ///////////////////////
    Colors: Colors,
    loading: loading,
    setLoading: setLoading,
    initialized: initialized,
    setInitialized: setInitialized,
    modalOpen: modalOpen,
    setModalOpen: (e) => setModalOpen(e),
    ///////////////////////

    setModal: (config) => {
      setModalConfig(config ?? {});
    },
  };

  return (
    <AppContext.Provider value={value}>
      <LoadingView visible={loading} />
      <Modal
        isOpen={modalOpen}
        widthModal={modalConfig?.widthModal ?? 250}
        onConfirm={modalConfig?.onConfirm ?? (() => setModalOpen(false))}
        confirmText={modalConfig?.confirmText ?? '確認'}
        onCancel={
          modalConfig?.onCancel ?? (() => setModalOpen(false))
        }
        cancelText={modalConfig?.cancelText ?? '取消'}
        content={modalConfig?.content}
      />

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
