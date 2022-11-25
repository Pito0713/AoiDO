import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import service from "../service/service";
import { AppContext } from '../../redux/AppContent';
import { useAppSelector } from '../../redux/store';
import Goback from '../../component/Goback'

const PlatformPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [productFilter, setProductFilter] = React.useState('');
  const [productFilterId, setProductFilterId] = React.useState('');
  const reduxToken = useAppSelector(state => state.token)

  const deleteItem = async (item) => {
    RN.Alert.alert(
      '是否刪除',
      "",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "確認",
          onPress: () => deleteCategory(item),
          style: "OK",
        },
      ], {}
    );
  }

  const postProductFilter = async () => {
    let submitData = {
      token: reduxToken
    }
    const response = await service.postProductFilter(submitData);
    if (!['', null, undefined].includes(response?.data)) setProductFilter(response.data)
  }

  const deleteCategory = async (item) => {
    let submitData = {
      searchText: '',
      token: reduxToken,
      category: [item.category]
    }
    const callProduct = await service.postAllProduct(submitData)
    await setProductFilterId(item._id)

    if (callProduct?.data.length > 0) {
      RN.Alert.alert(
        '分類還有相關產品是否全部刪除',
        "",
        [
          {
            text: "取消",
            style: "cancel",
          },
          {
            text: "確認",
            onPress: () => deleteProductCategory({ callProduct: callProduct.data, id: item._id }),
            style: "OK",
          },
        ], {}
      );
    } else {
      deleteProductFilter(item._id)
    }
  }

  const deleteProductCategory = async (item) => {
    let target = item.callProduct.map((item) => {
      return item._id
    })
    let submitData = {
      category: target
    }
    const response = await service.deleteProductCategory(submitData);
    if (response?.status === 'success') {
      deleteProductFilter(item.id)
    }
  }

  const deleteProductFilter = async (item) => {
    let submitData = {
      id: item
    }
    const response = await service.deleteProductFilter(submitData);
    if (response?.status === 'success') await postProductFilter()
  }

  React.useEffect(() => {
    (async () => {
      await appCtx.setLoading(true)
      if (isFocused) await postProductFilter()
      await appCtx.setLoading(false)
    })();
  }, [isFocused]);

  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <RN.ScrollView >
        <UI.View style={styles.container}>
          {productFilter.length > 0 ? productFilter.map((item, index) => {
            return (
              <UI.Card style={styles.itemContainer} onPress={() => navigation.navigate('productFilterItem', { item: item })} onLongPress={() => deleteItem(item)} key={index}>
                <UI.View style={styles.itemContent} >
                  <UI.Text style={styles.itemContentText}>{item.category}</UI.Text>
                </UI.View>
              </UI.Card>
            )
          }) :
            <UI.Card style={styles.itemContainer}>
              <UI.View style={styles.itemContent}>
                <UI.Text style={{ fontSize: 20 }}>尚無資料</UI.Text>
              </UI.View>
            </UI.Card>}
          <UI.Card style={styles.itemContainer} onPress={() => navigation.navigate('addProductFilterItem')}>
            <UI.View style={styles.itemContent}>
              <RN.Image
                source={require('../../assets/plus.png')}
                style={{ width: 25, height: 25 }}
              />
            </UI.View>
          </UI.Card>
        </UI.View>
      </RN.ScrollView >
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: 70,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContentText: {
    fontSize: 20
  }

});

export default PlatformPage;