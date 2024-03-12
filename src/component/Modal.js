import Modal from 'react-modal';
import * as RN from 'react-native';

// 设置虚拟根节点
Modal.setAppElement('#root');

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const CustomModal = ({
  isOpen = false,
  widthModal = 250,
  onConfirm = null,
  confirmText = '確認',
  onCancel = null,
  cancelText = '取消',
  content = ''
}) => {
  const customStyles = {
    content: {
      position: 'absolute',
      width: widthModal,
      height: 200,
      backgroundColor: "#e6e6e6",
      borderWidth: 2,
      left: windowWidth / 2 - widthModal / 1.7,
      right: '25%',
      top: '20%',
      borderRadius: 10,
    },
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} style={customStyles}>
      <RN.View style={{ justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '100%' }}>
        <RN.Text style={{ height: 80, fontSize: 20 }}>{content}</RN.Text>
        <RN.View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {onConfirm && <RN.TouchableOpacity
            style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginHorizontal: 10 }}
            onPress={onConfirm}>
            <RN.Text style={{ fontSize: 20 }}>{confirmText}</RN.Text>
          </RN.TouchableOpacity>
          }
          {onCancel && <RN.TouchableOpacity
            style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginHorizontal: 10 }}
            onPress={onCancel}>
            <RN.Text style={{ fontSize: 20 }}>{cancelText}</RN.Text>
          </RN.TouchableOpacity>}
        </RN.View>
      </RN.View>
    </Modal>
  );
};

export default CustomModal;
