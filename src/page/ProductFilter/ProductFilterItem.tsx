import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import { useFormik } from "formik";
import * as UI from 'react-native-ui-lib';
import service from "../Service/Service";
import Goback from '../../component/Goback'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
interface ProductFilterItem {
  // label?: string
  category?: string
  token?: string
}

const AddProductFilterItem = ({ route }: { route: any }) => {
  const target = route?.params?.item
  const appCtx = React.useContext(AppContext);
  const reduxToken = useAppSelector(state => state.token)
  const [productFilter, setProductFilter] = React.useState([]);
  const isFocused = useIsFocused();

  const postAllProduct = async () => {
    await appCtx.setLoading(true)
    let submitData = {
      searchText: '',
      token: reduxToken,
      category: [target.category]
    }

    const response = await service.postAllProduct(submitData);
    if (response?.data) setProductFilter(response.data)
    await appCtx.setLoading(false)
  }

  const deleteItem = async (item: string) => {
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
          style: "default",
        }
      ], {}
    );
  }

  const deleteCargo = async (item: string) => {
    // call api
    await appCtx.setLoading(true)
    let submitData = {
      "id": item,
    }
    const response = await service.deleteProductOne(submitData);
    if (response?.status === 'success') await postAllProduct()
    await appCtx.setLoading(false)
  }

  React.useEffect(() => {
    (async () => {
      await appCtx.setLoading(true)
      if (isFocused) await postAllProduct()
      await appCtx.setLoading(false)
    })();
  }, [isFocused]);

  return (
    <UI.View useSafeArea={true} style={styles.container}>
      <Goback />
      <UI.View>
        {productFilter.length > 0 ? productFilter.map((item, index) => {
          return (
            <UI.Card style={styles.itemContainer} key={index}>
              <UI.View style={styles.itemContent} >
                <UI.View style={{ flex: 2 }}>
                  <UI.Card.Image
                    source={{ uri: `${item.imageUrl}` }}
                    style={{ width: '105%', height:'105%', }}
                  />
                </UI.View>
                <UI.View style={{ flex: 4 }}><UI.Text style={styles.itemContentText} numberOfLines={1} ellipsizeMode={'tail'}>{item.describe}</UI.Text></UI.View>
                <UI.View style={{ flex: 2.5 }}><UI.Text style={styles.itemContentText} numberOfLines={1} ellipsizeMode={'tail'}>$ {item.price}</UI.Text></UI.View>
                <UI.TouchableOpacity style={{ flex: 1.5, alignItems: 'center' ,height:'100%',justifyContent: 'center',backgroundColor: appCtx.Colors.primary}} onPress={() => deleteItem(item._id)}>
                  <UI.Text>刪除</UI.Text>
                </UI.TouchableOpacity>
              </UI.View>
            </UI.Card>
          )
        }) :
          <UI.Card style={styles.itemContainer}>
            <UI.View style={styles.itemContent}>
              <UI.Text style={{ fontSize: 20 }}>尚無資料</UI.Text>
            </UI.View>
          </UI.Card>}
      </UI.View>
    </UI.View>
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
    overflow:'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContentText: {
    paddingLeft: 20,
    fontSize: 15
  }

});

export default AddProductFilterItem;
