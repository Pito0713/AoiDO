import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import service from "../Service/service";
import Goback from '../../component/Goback'
import { useIsFocused } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
import Pagination from '../../component/Pagination';
import ScrollViewComponent from '../../component/ScrollViewComponent';

interface ProductFilterItem {
  imageUrl?: string
  describe?: string
  price?: string 
  _id: string
}

const Content = (route : { params: any }) => {
  const target = route?.params?.item
  const appCtx = React.useContext(AppContext);
  const reduxToken = useAppSelector(state => state.token)

  const [productFilter, setProductFilter] = React.useState([]);
  const [pagination, setPagination] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const onPageChange = async (page:any) => {
    setPage(page);
  };

  const postAllProduct = async () => {
    let submitData = {
      searchText: '',
      token: reduxToken,
      category: [target.category],
      page: page,
      pagination: pagination,
    }
    await appCtx.setLoading(true)
    const response = await service.postAllProduct(submitData);
    if (response?.data) {
      setProductFilter(response.data)
      setTotal(response.total);
    }
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
    await appCtx.setLoading(true)
    let submitData = {
      "id": item,
    }
    const response = await service.deleteProductOne(submitData);
    if (response?.status === 'success') postAllProduct()
    await appCtx.setLoading(false)
  }


  React.useEffect(() => {
    postAllProduct();
  }, [page]);

  return (
    <RN.View >
      {productFilter.length > 0 ? productFilter.map((item : ProductFilterItem, index) => {
        return (
          <RN.View style={styles.itemContainer} key={index}>
            <RN.View style={styles.itemContent} >
              <RN.View style={{ flex: 2 }}>
                <RN.Image
                  source={{ uri: `${item.imageUrl }` }}
                  style={{ width: '105%', height:'105%', }}
                />
              </RN.View>
              <RN.View style={{ flex: 4 }}><RN.Text style={styles.itemContentText} numberOfLines={1} ellipsizeMode={'tail'}>{item.describe}</RN.Text></RN.View>
              <RN.View style={{ flex: 2.5 }}><RN.Text style={styles.itemContentText} numberOfLines={1} ellipsizeMode={'tail'}>$ {item.price}</RN.Text></RN.View>
              <RN.TouchableOpacity style={{ flex: 1.5, alignItems: 'center' ,height:'100%',justifyContent: 'center',backgroundColor: appCtx.Colors.primary}} onPress={() => deleteItem(item._id)}>
                <RN.Text>刪除</RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
        )
      }) :
        <RN.View style={styles.itemContainer}>
          <RN.View style={styles.itemContent}>
            <RN.Text style={{ fontSize: 20 }}>尚無資料</RN.Text>
          </RN.View>
        </RN.View>}
      <Pagination
        page={page}
        pagination={pagination}
        total={total}
        onPageChange={onPageChange}
      />
    </RN.View>
  );
};

const ProductFilterItem = ({ route }: { route: any }) => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={() => Content(route)}></ScrollViewComponent>
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
  },
});

export default ProductFilterItem;
