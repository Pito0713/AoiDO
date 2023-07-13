import React from "react";
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SvgUri from 'react-native-svg-uri';

const Goback = () => {
  const navigation = useNavigation();
  return (
    <RN.TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
      <SvgUri width="40" height="40" source={require('../assets/ArrowLeft.svg')} />
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