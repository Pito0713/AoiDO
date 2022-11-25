import React from "react";
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Goback = () => {
  const navigation = useNavigation();
  return (
    <RN.TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
      <RN.Image
        source={require('../assets/leftArrow.png')}
        style={{ width: 25, height: 25 }}
      />
    </RN.TouchableOpacity>
  )
}

const styles = RN.StyleSheet.create({
  iconContainer: {
    padding: 20,
    width: 70,
    justifyContent: 'center',
  },
})


export default Goback;