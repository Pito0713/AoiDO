import React from "react";
import * as RN from 'react-native';

const windowHeight = RN.Dimensions.get('window').height;

const ScrollViewComponent = (props:any) => {
  return (
    props?.item() ?
      (RN.Platform.OS !== "ios" && RN.Platform.OS !== "web") ?
        <RN.ScrollView>
          <RN.KeyboardAvoidingView keyboardVerticalOffset={windowHeight}>
            <RN.TouchableOpacity activeOpacity={1} onPress={RN.Keyboard.dismiss}>
              {props.item()}
            </RN.TouchableOpacity>
          </RN.KeyboardAvoidingView>
        </RN.ScrollView>
        :
        <RN.KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled >
          <RN.TouchableOpacity activeOpacity={1} onPress={RN.Keyboard.dismiss}>
            <RN.ScrollView>
              {props.item()}
            </RN.ScrollView>
          </RN.TouchableOpacity>
        </RN.KeyboardAvoidingView>
    : <RN.View></RN.View>
  )
}
export default ScrollViewComponent;