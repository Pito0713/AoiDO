import React from "react";
import * as RN from 'react-native';
import { AppContext } from '../../redux/AppContent';
import service from "../Service/service";
import Goback from '../../component/Goback'
import { useAppSelector } from '../../redux/store';
import Pagination from '../../component/Pagination';
import Modal from '../../component/Modal';

interface ProductFilterItem {
  imageUrl?: string
  describe?: string
  price?: string 
  _id: string
}

const ProductFilterItem = ({ route }: { route: any }) => {
  const target = route?.params?.item
  const appCtx = React.useContext(AppContext);
  const reduxToken = useAppSelector(state => state.token)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('');
  const openModal = (item:any) => {
    setModalOpen(true);
    setDeleteId(item);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteId('');
  };

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

  const deleteCargo = async () => {
    await appCtx.setLoading(true)
    let submitData = {
      "id": deleteId,
    }
    const response = await service.deleteProductOne(submitData);
    if (response?.status === 'success') postAllProduct()
    closeModal();
    await appCtx.setLoading(false)
  }


  React.useEffect(() => {
    postAllProduct();
  }, [page]);

  return (
    <RN.SafeAreaView style={styles.container}>
    <Goback />
    <RN.View >
      {productFilter.length > 0 ? productFilter.map((item : ProductFilterItem, index) => {
        return (
          <RN.View style={styles.itemContainer} key={index}>
            <RN.View style={styles.itemContent} >
              <RN.View style={{ width: 100 ,alignItems: 'center' ,justifyContent: 'center',}}>
                <RN.Image
                  source={{ uri: `${item.imageUrl }` }}
                  style={{ width: 70, height: 70, }}
                />
              </RN.View>
              <RN.View style={{ width: 200 }}><RN.Text style={styles.itemContentText} numberOfLines={1} ellipsizeMode={'tail'}>{item.describe}</RN.Text></RN.View>
              <RN.View style={{ width: 80 }}><RN.Text style={styles.itemContentText} numberOfLines={1} ellipsizeMode={'tail'}>$ {item.price}</RN.Text></RN.View>
              <RN.TouchableOpacity 
                style={{ width: 75, alignItems: 'center' ,height:'100%',justifyContent: 'center',backgroundColor: appCtx.Colors.primary}} 
                onPress={() => openModal(item._id)}
              >
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
    <Modal
        isOpen={modalOpen}
        confirm={() => deleteCargo()}
        cancel={closeModal}
        content={'是否刪除'}
      />
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
    borderRadius: 10
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
