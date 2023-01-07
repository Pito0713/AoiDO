import React from "react";
import * as RN from 'react-native';

interface props {
  page: number
  pagination: number
  total: number
  onPageChange: (value:number|undefined) => void,
}

const Pagination = (props:props) => {
  return (
    <RN.View style={styles.container}>
      <RN.View>
        <RN.Text style={[styles.textContainer]}> {`${(props.pagination*(props.page-1)+1)} - ${(props.pagination*(props.page))} of  ${props.total}`}</RN.Text>
      </RN.View> 
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
      {(props.total > 10 && props.page * props.pagination < props.total) ? 
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
    </RN.View>
  )
}

const styles = RN.StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 2,

  },
  iconContainer: {
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3
  },
})


export default Pagination;