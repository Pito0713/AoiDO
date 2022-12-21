import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as RN from 'react-native';
import {AppContext} from '../../redux/AppContent';

const Tab = createBottomTabNavigator();
const bottomTab = [
  {
    name: 'product',
    component: require('../Product').default,
  },
  {
    name: 'logistics',
    component: require('../Logistics').default,
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
              if (focused) iconName = require('../../assets/plus.png');
              else iconName = require('../../assets/transfer.png');
            }
            if (route.name === 'logistics') {
              if (focused) iconName = require('../../assets/plus.png');
              else iconName = require('../../assets/logistics.png');
            }
            if (route.name === 'product') {
              if (focused) iconName = require('../../assets/plus.png');
              else iconName = require('../../assets/box.png');
            }
            if (route.name === 'setting') {
              if (focused) iconName = require('../../assets/plus.png');
              else iconName = require('../../assets/setting.png');
            }

            return (
              <RN.Image source={iconName} style={{width: 25, height: 25}} />
            );
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
