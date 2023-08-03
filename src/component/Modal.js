import Modal from 'react-modal';
import * as RN from 'react-native';

// 设置虚拟根节点
Modal.setAppElement('#root');

const CustomModal = ({isOpen, confirm, cancel, content}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={cancel}>
      <RN.View style={{justifyContent: 'center', alignItems: 'center'}}>
        <RN.Text style={{height: 80, fontSize: 20}}>{content}</RN.Text>
        <RN.View
          style={{
            flexDirection: 'row',
            width: '30%',
            justifyContent: 'space-between',
          }}>
          <RN.TouchableOpacity
            style={{padding: 10, borderWidth: 1, borderRadius: 5}}
            onPress={cancel}>
            <RN.Text style={{fontSize: 20}}>取消</RN.Text>
          </RN.TouchableOpacity>
          <RN.TouchableOpacity
            style={{padding: 10, borderWidth: 1, borderRadius: 5}}
            onPress={confirm}>
            <RN.Text style={{fontSize: 20}}>確認</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.View>
    </Modal>
  );
};

export default CustomModal;
