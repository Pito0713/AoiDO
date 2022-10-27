import React from 'react'
import * as RN from 'react-native';
import LottieView from 'lottie-react-native';


class LottieIcon extends React.PureComponent {
  render(){
      return (
        <RN.View style={styles.container}>
          <LottieView 
            source={require('../../assets/296-react-logo.json')}
            style={{height: 500, width: 500}}
            autoPlay 
            loop
          />
        </RN.View>
      );
  }
  
}

const styles = RN.StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default LottieIcon;
