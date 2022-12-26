import React from "react";
import * as RN from 'react-native';
import { cos } from "react-native-reanimated";

interface props {
  page: number
  pagination: number
  total: number
  onPageChange: (value:number|undefined) => void,
}

const Pagination = (props:props) => {
  return (
    <RN.View style={styles.container}>
      { props.page > 1 ? 
        <RN.TouchableOpacity style={styles.iconContainer}  onPress={()=>props.onPageChange(props.page -1)}>
          <RN.Image
            source={require('../assets/leftArrow.png')}
            style={{ width: 20, height: 20 }}
          />
        </RN.TouchableOpacity>
        :
        <RN.View style={styles.iconContainer}>
          <RN.Image
            source={require('../assets/leftArrow.png')}
            style={{ width: 20, height: 20 }}
          />
        </RN.View>
      }
      <RN.Text style={styles.textContainer}> {props.page}</RN.Text>
      {props.total > 10 ? 
        <RN.TouchableOpacity style={styles.iconContainer} onPress={()=>props.onPageChange(props.page +1)}>
          <RN.Image
            source={require('../assets/rightArrow.png')}
            style={{ width: 20, height: 20 }}
          />
        </RN.TouchableOpacity>
        :
        <RN.View  style={styles.iconContainer}>
          <RN.Image
            source={require('../assets/rightArrow.png')}
            style={{ width: 20, height: 20 }}
          />
        </RN.View> 
      }
      <RN.View >
        <RN.Text style={[styles.textContainer,{marginRight:20}]}> {`${(props.pagination*(props.page-1)+1)} - ${(props.pagination*(props.page))} of  ${props.total}`}</RN.Text>
      </RN.View> 
    </RN.View>
  )
}

const windowHeight = RN.Dimensions.get('window').height;

const styles = RN.StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    margin: 2.5,
  },
  iconContainer: {
    padding:12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default Pagination;