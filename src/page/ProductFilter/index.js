import React from 'react';
import * as RN from 'react-native';
import * as UI from 'react-native-ui-lib';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import SvgUri from 'react-native-svg-uri';

import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import {useAppSelector} from '../../redux/store';
import Goback from '../../component/Goback';
import ReminderText from '../../component/ReminderText';
import ScrollViewComponent from '../../component/ScrollViewComponent';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [productFilter, setProductFilter] = React.useState('');
  const reduxToken = useAppSelector(state => state.token);

  const deleteItem = item => {
    RN.Alert.alert(
      '是否刪除',
      '',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => deleteCategory(item),
          style: 'OK',
        },
      ],
      {},
    );
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
      category: [item.category],
      page: 1,
      pagination: 9999,
    };
    const callProduct = await service.postAllProduct(submitData);

    if (callProduct?.total > 0) {
      RN.Alert.alert(
        '分類還有相關產品是否全部刪除',
        '',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '確認',
            onPress: () =>
              deleteProductCategory({
                callProduct: callProduct.data,
                id: item._id,
              }),
            style: 'OK',
          },
        ],
        {},
      );
    } else {
      deleteProductFilter(item._id);
    }
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
              <UI.Card
                style={styles.itemContainer}
                onPress={() =>
                  navigation.navigate('productFilterItem', {item: item})
                }
                onLongPress={() => deleteItem(item)}
                key={index}>
                <RN.View style={styles.itemContent}>
                  <RN.Text style={styles.itemContentText}>
                    {item.category}
                  </RN.Text>
                </RN.View>
              </UI.Card>
            ) : (
              <UI.Card style={styles.itemContainer} key={index}>
                <RN.View style={styles.itemContent}>
                  <RN.Text
                    style={[
                      styles.itemContentText,
                      {color: appCtx.Colors.productFilterDefault},
                    ]}>
                    {item.category}
                  </RN.Text>
                </RN.View>
              </UI.Card>
            );
          })
        ) : (
          <UI.Card style={styles.itemContainer}>
            <RN.View style={styles.itemContent}>
              <RN.Text style={{fontSize: 20}}>尚無資料</RN.Text>
            </RN.View>
          </UI.Card>
        )}
        <UI.Card
          style={styles.itemContainer}
          onPress={() => navigation.navigate('addProductFilterItem')}>
          <RN.View style={styles.itemContent}>
            <SvgUri
              width="30"
              height="30"
              source={require('../../assets/plus.svg')}
            />
          </RN.View>
        </UI.Card>
      </RN.View>
    </RN.View>
  );
};

const ProductFilterPage = () => {
  return (
    <RN.SafeAreaView style={styles.container}>
      <Goback />
      <ScrollViewComponent item={Content}></ScrollViewComponent>
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
