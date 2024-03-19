import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../redux/AppContent';

const TitleText = (props: any) => {
  const appCtx = React.useContext(AppContext);
  return (
    <RN.View>
      <RN.Text
        style={[
          styles.listText,
          { borderColor: appCtx.Colors.textPrimary },
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
    fontSize: 20,
  },
});
export default TitleText;