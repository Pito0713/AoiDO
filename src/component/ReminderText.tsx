import React from "react";
import * as RN from 'react-native';
import {AppContext} from '../redux/AppContent';

const ReminderText = (props:any) => {
  const appCtx = React.useContext(AppContext);
  return (
    <RN.View>
      <RN.Text
        style={[
          styles.listText,
          {borderColor: appCtx.Colors.proudcutFilter.text},
        ]}>
        {props.text}
      </RN.Text>
    </RN.View>
  )
}

const styles = RN.StyleSheet.create({
  listText: {
    textAlign: 'center',
    margin: 2,
    fontSize: 12.5,
  },
});
export default ReminderText;