import React from "react";
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from "../assets/ArrowLeft";

const Goback = () => {
  const navigation = useNavigation();
  return (
    <RN.TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
      <ArrowLeft />
    </RN.TouchableOpacity>
  )
}

const styles = RN.StyleSheet.create({
  iconContainer: {
    padding: 20,
    width: 70,
    hight: 70,
  },
})


export default Goback;