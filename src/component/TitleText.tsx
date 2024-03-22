import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../redux/AppContent';

const TitleText = (props: any) => {
  const appCtx = React.useContext(AppContext);
  return (
    <RN.View style={{ flexDirection: 'row', width: '100%', backgroundColor: appCtx.Colors.titleBG, padding: 10 }}>
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
    marginHorizontal: 10,
    fontSize: 20,
  },
});
export default TitleText;