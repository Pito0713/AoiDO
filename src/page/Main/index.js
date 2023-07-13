import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as RN from 'react-native';
import {AppContext} from '../../redux/AppContent';
import SvgUri from 'react-native-svg-uri';

const Tab = createBottomTabNavigator();
const bottomTab = [
  {
    name: 'product',
    component: require('../Product').default,
  },
  {
    name: 'coupon',
    component: require('../Coupon').default,
  },
  {
    name: 'transfer',
    component: require('../Transfer').default,
  },
  {
    name: 'setting',
    component: require('../Setting').default,
  },
];

const MainPage = () => {
  const appCtx = React.useContext(AppContext);
  return (
    <RN.View style={styles.container}>
      <Tab.Navigator
        initialRouteName="product"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarItemStyle: {borderTopWidth: 1.5},
          tabBarActiveBackgroundColor: appCtx.Colors.primary,
          tabBarActiveTintColor: appCtx.Colors.textPrimary,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'transfer') {
              iconName = require('../../assets/transfer.svg');
            }
            if (route.name === 'coupon') {
              iconName = require('../../assets/ticket.svg');
            }
            if (route.name === 'product') {
              iconName = require('../../assets/product.svg');
            }
            if (route.name === 'setting') {
              iconName = require('../../assets/setting.svg');
            }

            return <SvgUri source={iconName} width="25" height="25" />;
          },
        })}>
        {bottomTab.map(item => (
          <Tab.Screen
            key={item.name}
            name={item.name}
            component={item.component}
          />
        ))}
      </Tab.Navigator>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default MainPage;
