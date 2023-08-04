import React from 'react';
import * as RN from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Order from '../../assets/Order';
import Ticket from '../../assets/Ticket';
import Product from '../../assets/Product';
import Setting from '../../assets/Setting';

import {AppContext} from '../../redux/AppContent';

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
    name: 'order',
    component: require('../Order').default,
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

            if (route.name === 'order') {
              return <Order />;
            }
            if (route.name === 'coupon') {
              return <Ticket />;
            }
            if (route.name === 'product') {
              return <Product />;
            }
            if (route.name === 'setting') {
              return <Setting />;
              ß;
            }
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
