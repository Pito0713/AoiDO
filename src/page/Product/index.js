import React from "react";
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import service from "../Service/Service";
import { AppContext } from '../../redux/AppContent';
import { useAppSelector } from '../../redux/store';
import Fillter from '../../component/Filter'

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Logistics = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const reduxToken = useAppSelector(state => state.token)

  const [product, setProduct] = React.useState([]);
  const [text, onChangeText] = React.useState("");
  const [categoryValue, setCategoryValue] = React.useState("");
  const [showDialog, setShowDialog] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    await setRefreshing(true);
    await postSearchProduct();
    /// 預防請求失敗
    await setRefreshing(false);
  }, [refreshing]);

  const delay = (time) => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        setRefreshing(false);
      }, time);
    });
  }


  const postSearchProduct = async () => {
    let target = []
    Object.entries(categoryValue).forEach(([key, value]) => {
      if (value) target.push(key)
    });

    let submitData = {
      searchText: text,
      token: reduxToken,
      category: target
    }
    await appCtx.setLoading(true)
    const response = await service.postAllProduct(submitData);
    await appCtx.setLoading(false)

    if (response?.status === 'success') setProduct(response.data)
  }

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
          onPress: () => deleteCargo(item),
          style: "OK",
        }
      ], {}
    );
  }

  const deleteCargo = async (item) => {
    let submitData = {
      "id": item,
    }
    const response = await service.deleteProductOne(submitData);
    if (response?.status === 'success') await postSearchProduct()
  }

  React.useEffect(() => {
    (async () => {
      
      if (isFocused) await postSearchProduct()
      if (!isFocused) await onChangeText('')
      await appCtx.setLoading(false)
    })();
  }, [isFocused]);

  React.useEffect(() => {
    (async () => {
      if (!showDialog) await postSearchProduct()
    })();
  }, [showDialog]);

  return (
    <RN.SafeAreaView style={styles.container}>
      <UI.View style={styles.searchContainer}>
        <UI.View style={[styles.searchContent, { backgroundColor: appCtx.Colors.inputContainer }]}>
          <RN.Image
            source={require('../../assets/search.png')}
            style={{ width: 20, height: 20, marginLeft: 15 }}
          />
          <RN.TextInput
            style={styles.searchInput}
            onChangeText={onChangeText}
            value={text}
            placeholder={'搜尋商品描述'}
            textAlign='left'
            placeholderTextColor="gray"
          />
        </UI.View>
        <RN.TouchableOpacity style={[styles.searchContentText, { backgroundColor: appCtx.Colors.primary }]} onPress={() => postSearchProduct()}>
          <UI.Text style={[styles.searchText, { color: appCtx.Colors.textPrimary }]}>搜尋</UI.Text>
        </RN.TouchableOpacity>
        <Fillter categoryValue={setCategoryValue} ShowDialog={setShowDialog} />
      </UI.View>
      <RN.ScrollView
        refreshControl={
          <RN.RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appCtx.Colors.primary]}
            tintColor={appCtx.Colors.primary}
            progressViewOffset={-5}
          />
        }
      >
        <UI.View style={styles.productContainer}>
          {product.length > 0 ? product.map((item, index) => {
            return (
              <UI.Card
                style={[styles.itemContainer, { backgroundColor: appCtx.Colors.proudcut.cardContianer }]}
                onPress={() => navigation.navigate('ProductItem', { item })}
                onLongPress={() => deleteItem(item._id)}
                key={index}
              >
                <RN.ImageBackground
                  source={{ uri: `${item.imageUrl}` }}
                  style={{ width: '100%', height: '100%', }}
                  resizeMode="cover"
                >
                  <UI.View style={[styles.itemContentTextContainer]} >
                    <UI.View style={[styles.itemContentText, { alignItems: 'flex-end' }]}>
                      <UI.Text style={{ paddingLeft: 5, borderTopRightRadius: 10, color: appCtx.Colors.proudcut.cardTitleText, width: '35%', backgroundColor: appCtx.Colors.proudcut.cardTitle }}>{item.category}</UI.Text>
                    </UI.View>
                    <UI.View style={[styles.itemContentText, { backgroundColor: appCtx.Colors.proudcut.cardContianer, alignItems: 'center' }]}>
                      <UI.Text style={[{ color: appCtx.Colors.proudcut.cardText, flex: 6, marginLeft: 15 }]} numberOfLines={1} ellipsizeMode={'tail'}>{item.describe}</UI.Text>
                      <UI.Text style={[{ color: appCtx.Colors.proudcut.cardText, flex: 4 }]} numberOfLines={1} ellipsizeMode={'tail'}> $ {Number(item.price)}</UI.Text>
                    </UI.View>
                  </UI.View>
                </RN.ImageBackground>

              </UI.Card>
            )
          })
            :
            <UI.Card style={styles.itemContainer}>
              <UI.View style={[{ justifyContent: 'space-around', alignItems: 'center', height: '100%' }]} >
                <UI.Text style={{ fontSize: 20 }}>暫無資料</UI.Text>
              </UI.View>
            </UI.Card>
          }
          <UI.Card style={styles.itemContainer} onPress={() => { navigation.navigate('AddProductItem') }}>
            <UI.View style={[styles.itemContent]}>
              <RN.Image
                source={require('../../assets/plus.png')}
                style={{ width: 25, height: 25, }}
              />
            </UI.View>
          </UI.Card>
        </UI.View >
      </RN.ScrollView>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  productContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
    flexWrap: 'wrap'
  },
  itemContainer: {
    height: windowHeight / 4,
    width: windowWidth / 2 - 15,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center'
  },
  itemContentTextContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: '100%'
  },
  itemContentText: {
    height: 25,
    width: '100%',
    flexDirection: 'row',
  },
  itemContentTitle: {
    height: 20,
    width: '40%',
    position: 'absolute',
    top: windowHeight / 4,
    left: 0,
    zIndex: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    margin: 10,
    alignItems: 'center',
    width: windowWidth - 20,
  },
  searchContent: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flex: 7.5,
    borderWidth: 1.5,
    borderRightWidth: 0,
  },
  searchContentText: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    flex: 2.5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  searchText: {
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  searchInput: {
    marginLeft: 5,
    width: '100%',
    fontSize: 15,
    height: '99%',
  },
});

export default Logistics;