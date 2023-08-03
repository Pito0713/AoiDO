import React from 'react';
import * as RN from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Plus from '../../assets/Plus';
import Cancel from '../../assets/Cancel';

import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import {useAppSelector} from '../../redux/store';
import Goback from '../../component/Goback';
import ReminderText from '../../component/ReminderText';
import Modal from '../../component/Modal';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [productFilter, setProductFilter] = React.useState('');
  const reduxToken = useAppSelector(state => state.token);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('');
  const [deleteIdCategory, setDeleteIdCategory] = React.useState('');
  const openModal = item => {
    setModalOpen(true);
    setDeleteId(item._id);
    setDeleteIdCategory(item.category);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteId('');
  };

  const postProductFilter = async () => {
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter(item => {
        return item.token !== '1';
      });
      setProductFilter(target);
    }
  };

  const deleteCategory = async item => {
    let submitData = {
      searchText: '',
      token: reduxToken,
      category: [deleteIdCategory],
      page: 1,
      pagination: 9999,
    };
    const callProduct = await service.postAllProduct(submitData);

    if (callProduct?.total > 0) {
      deleteProductCategory({
        callProduct: callProduct.data,
        id: deleteId,
      });
    } else {
      deleteProductFilter(deleteId);
    }
    closeModal();
  };

  const deleteProductCategory = async item => {
    let target = item.callProduct.map(item => {
      return item._id;
    });
    let submitData = {
      category: target,
    };
    const response = await service.deleteProductCategory(submitData);
    if (response?.status === 'success') {
      deleteProductFilter(item.id);
    }
  };

  const deleteProductFilter = async item => {
    let submitData = {
      id: item,
    };
    const response = await service.deleteProductFilter(submitData);
    if (response?.status === 'success') postProductFilter();
  };

  React.useEffect(() => {
    (async () => {
      await appCtx.setLoading(true);
      if (isFocused) postProductFilter();
      await appCtx.setLoading(false);
    })();
  }, [isFocused]);

  return (
    <RN.View>
      <RN.View
        style={[
          styles.listContainer,
          {borderColor: appCtx.Colors.proudcutFilter.borderPrimary},
        ]}>
        <ReminderText text={'* 點擊分類可以查類別商品'} />
        <ReminderText text={'* 長按可刪除分類別'} />
        <ReminderText text={'* 請注意刪除類別, 類別商品會連同刪除'} />
      </RN.View>
      <RN.View style={styles.container}>
        {productFilter.length > 0 ? (
          productFilter.map((item, index) => {
            return item.token !== '1' ? (
              <RN.View>
                <RN.TouchableOpacity
                  style={{margin: 10}}
                  onPress={() => openModal(item)}>
                  <Cancel />
                </RN.TouchableOpacity>
                <RN.TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() =>
                    navigation.navigate('productFilterItem', {item: item})
                  }
                  key={index}>
                  <RN.View style={styles.itemContent}>
                    <RN.Text style={styles.itemContentText}>
                      {item.category}
                    </RN.Text>
                  </RN.View>
                </RN.TouchableOpacity>
              </RN.View>
            ) : (
              <RN.View style={styles.itemContainer} key={index}>
                <RN.View style={styles.itemContent}>
                  <RN.Text
                    style={[
                      styles.itemContentText,
                      {color: appCtx.Colors.productFilterDefault},
                    ]}>
                    {item.category}
                  </RN.Text>
                </RN.View>
              </RN.View>
            );
          })
        ) : (
          <RN.View style={styles.itemContainer}>
            <RN.View style={styles.itemContent}>
              <RN.Text style={{fontSize: 20}}>尚無資料</RN.Text>
            </RN.View>
          </RN.View>
        )}
        <RN.TouchableOpacity
          style={[styles.itemContainer, {marginTop: 40}]}
          onPress={() => navigation.navigate('addProductFilterItem')}>
          <RN.View style={styles.itemContent}>
            <Plus />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <Modal
        isOpen={modalOpen}
        confirm={() => deleteCategory()}
        cancel={closeModal}
        content={'分類還有相關產品是否全部刪除'}
      />
    </RN.View>
  );
};

const ProductFilterPage = () => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <Content />
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
    borderRadius: 10,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContentText: {
    fontSize: 20,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  listText: {
    textAlign: 'center',
    margin: 2,
    fontSize: 12.5,
  },
});

export default ProductFilterPage;
