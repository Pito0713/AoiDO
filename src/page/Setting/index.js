import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { registerActions, useAppDispatch } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const logOut = () => {
    dispatch(registerActions.SET_TOKEN(''));
  }

  return (
    <RN.SafeAreaView style={styles.container}>
      <UI.ListItem style={styles.itemContainer} onPress={() => navigation.navigate('platform')}>
        <UI.Text style={styles.text}>自訂平台費用</UI.Text>
      </UI.ListItem>
      <UI.ListItem style={styles.itemContainer} onPress={() => navigation.navigate('productFilter')}>
        <UI.Text style={styles.text}>自訂商品分類</UI.Text>
      </UI.ListItem>
      <UI.ListItem style={styles.itemContainer} onPress={() => navigation.navigate('handPassWord')}>
        <UI.Text style={styles.text}>修改密碼</UI.Text>
      </UI.ListItem>
      <UI.ListItem style={styles.itemContainer} onPress={() => logOut()}>
        <UI.Text style={styles.text}>登出</UI.Text>
      </UI.ListItem>
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  itemContainer: {
    height: 70,
    alignItems: 'center'
  },
  text: {
    fontSize: 17
  }
});

export default Setting;