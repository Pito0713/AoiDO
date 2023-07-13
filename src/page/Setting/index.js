import React from 'react';
import * as RN from 'react-native';
import {registerActions, useAppDispatch} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../../redux/AppContent';
import ScrollViewComponent from '../../component/ScrollViewComponent';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const logOut = () => {
    dispatch(registerActions.SET_TOKEN(''));
  };

  const List = [
    {title: '自訂跑馬燈', action: () => navigation.navigate('CarouselImg')},
    {title: '自訂商品大綱圖片', action: () => navigation.navigate('MainImg')},
    {title: '自訂關於圖片', action: () => navigation.navigate('AboutImg')},
    {title: '自訂平台費用', action: () => navigation.navigate('platform')},
    {title: '自訂商品分類', action: () => navigation.navigate('productFilter')},
    {title: '修改密碼', action: () => navigation.navigate('handPassWord')},
    {title: '登出', action: () => logOut()},
  ];

  return (
    <RN.View style={styles.container}>
      {List.map((item, index) => {
        return (
          <RN.TouchableOpacity
            style={[
              styles.itemContainer,
              {backgroundColor: appCtx.Colors.Setting.cardTitle},
            ]}
            onPress={item.action}
            key={index}>
            <RN.Text
              style={[styles.text, {color: appCtx.Colors.Setting.cardText}]}>
              {item.title}
            </RN.Text>
          </RN.TouchableOpacity>
        );
      })}
    </RN.View>
  );
};

const Setting = () => {
  return (
    <RN.SafeAreaView style={{flex: 1}}>
      <ScrollViewComponent item={Content} />
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    marginTop: 25,
    height: 60,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    width: '75%',
  },
  text: {
    fontSize: 17.5,
    borderWidth: 0,
  },
});

export default Setting;
