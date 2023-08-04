import React from "react";
import * as RN from 'react-native';
//@ts-ignore
import { useNavigation } from '@react-navigation/native';

import service from "../Service/service";
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import ScrollViewComponent from "../../component/ScrollViewComponent";

interface Order {
  id: string;
}

const Content = (route : { params: any }) => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation<Nav>();
  type Nav = {
    navigate: (value: string | undefined) => void,
    goBack: () => void,
  }

  const deleteItem = () => {
    RN.Alert.alert(
      '是否刪除',
      "",
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: "確認",
          onPress: () => deleteOneOrder(route.params.item._id)
        }
      ], {}
    );
  }

  const deleteOneOrder = async (item: string) => {
    await appCtx.setLoading(true)

    let submitData: Order = {
      id: item,
    };
    const response = await service.deleteOneOrder(submitData);
    await appCtx.setLoading(false)
    if (response?.status === 'success') navigation.goBack()
  }

  return (
    <RN.View style={styles.itemContainer}>
      <RN.Text style={styles.titleText}>訂單資料: </RN.Text>
      <RN.View style={[styles.infoContainer]} >
        <RN.View style={styles.infoContent}>
          <RN.Text>姓名:</RN.Text>
          <RN.Text>{route.params.item.infoData.uesrName}</RN.Text>
        </RN.View>
        <RN.View style={styles.infoContent}>
          <RN.Text>地址:</RN.Text>
          <RN.Text>{route.params.item.infoData.city} {route.params.item.infoData.town} {route.params.item.infoData.addres}</RN.Text>
        </RN.View>
        <RN.View style={styles.infoContent}>
          <RN.Text>電話:</RN.Text>
          <RN.Text>{route.params.item.infoData.phone}</RN.Text>
        </RN.View>
      </RN.View>
      <RN.Text style={styles.titleText}>商品明細: </RN.Text>
      <RN.View style={[styles.checkListContainer]} >
        {route.params.item.ProductList.map((item: { imageUrl: any; describe: any; quantity: any; category:any }, index: any) => {
          return (
            <RN.View
              style={[
                {
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  padding: 10,
                },
              ]}
              key={index}>
              <RN.Image
                source={{uri: `${item.imageUrl}`}}
                style={{width: 60, height: 60}}
              />
              <RN.View style={[
                {
                  paddingLeft: 10,
                },
              ]}>
                <RN.Text>
                  {`分類:  ${item.category}`}
                </RN.Text>
                <RN.Text>
                  {`名稱:  ${item.describe}`}
                </RN.Text>
                <RN.Text>
                  {`數量:  ${item.quantity}`}
                </RN.Text>
                </RN.View>
            </RN.View>
          );
        })}
      </RN.View>
      <RN.Text style={styles.titleText}>訂單詳情: </RN.Text>
      <RN.View style={[styles.totalContainer]} >
        <RN.View style={styles.totalContent}>
          <RN.Text>商品筆數: {route.params.item.totalQuantity}</RN.Text>
        </RN.View>
        <RN.View style={styles.totalContent}>
          <RN.Text>總訂單金額: {route.params.item.totalPrice}</RN.Text>
        </RN.View>
      </RN.View>
      <RN.View style={styles.buttonContainer}>
        <RN.TouchableOpacity style={[styles.buttonContent, { backgroundColor: appCtx.Colors.primary }]}  onPress={() => deleteItem()}>
          <RN.Text >刪除</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};

const CouponItem = ({ route }: { route: any }) => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={()=>Content(route)}/>
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  infoContainer: {
    borderWidth: 1.5,
    marginTop: 6,
    borderRadius: 10,
  },
  infoContent:{
    marginLeft: 10,
    padding: 5
  },
  checkListContainer: {
    borderWidth: 1.5,
    marginTop: 6,
    borderRadius: 10,
  },
  totalContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1.5,
    marginTop: 6,
    borderRadius: 10,
  },
  totalContent:{
    width: '40%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContent: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  titleText: {
    marginTop: 12,
    fontSize: 20
  }
});

export default CouponItem;