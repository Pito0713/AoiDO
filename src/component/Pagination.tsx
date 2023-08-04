import React from "react";
import * as RN from 'react-native';
import ArrowLeft from "../assets/ArrowLeft";
import ArrowRight from "../assets/ArrowRight";

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
        <RN.TouchableOpacity style={styles.iconContainer}  onPress={ props.page > 1 ? ()=>props.onPageChange(props.page -1) : ()=>{}}>
          <ArrowLeft />
        </RN.TouchableOpacity>
      <RN.Text style={styles.textContainer}> {props.page}</RN.Text>
        <RN.TouchableOpacity style={styles.iconContainer} onPress={(props.total > 10 && props.page * props.pagination < props.total) ? ()=>props.onPageChange(props.page +1) : ()=>{}}>
          <ArrowRight />
        </RN.TouchableOpacity>
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