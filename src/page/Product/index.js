import React from 'react';
import * as RN from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Search from '../../assets/Search';
import Plus from '../../assets/Plus';

import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import {useAppSelector} from '../../redux/store';
import Fillter from '../../component/Filter';
import Pagination from '../../component/Pagination';

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Coupon = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const reduxToken = useAppSelector(state => state.token);

  const [product, setProduct] = React.useState([]);
  const [text, onChangeText] = React.useState('');
  const [categoryValue, setCategoryValue] = React.useState('');
  const [showDialog, setShowDialog] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const [pagination, setPagination] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    postSearchProduct();
    /// 預防請求失敗
    setRefreshing(false);
  };

  const onPageChange = page => {
    setPage(page);
  };

  const postSearchProduct = async () => {
    let target = [];
    Object.entries(categoryValue).forEach(([key, value]) => {
      if (value) target.push(key);
    });

    let submitData = {
      searchText: text,
      token: reduxToken,
      category: target,
      page: page,
      pagination: pagination,
    };
    await appCtx.setLoading(true);
    const response = await service.postAllProduct(submitData);

    if (response?.status === 'success') {
      setSearchText(text);
      setProduct(response.data);
      setTotal(response.total);
    }
    await appCtx.setLoading(false);
  };

  const deleteCargo = async item => {
    let submitData = {
      id: item,
    };
    await appCtx.setLoading(true);
    const response = await service.deleteProductOne(submitData);
    if (response?.status === 'success') postSearchProduct();
    await appCtx.setLoading(false);
  };

  React.useEffect(() => {
    if (isFocused) postSearchProduct();
  }, [isFocused]);

  React.useEffect(() => {
    if (!showDialog && page > 1) onPageChange(1);
    if (!showDialog && page == 1) postSearchProduct();
  }, [showDialog]);

  React.useEffect(() => {
    postSearchProduct();
  }, [page]);

  return (
    <RN.SafeAreaView style={styles.container}>
      <RN.View style={styles.searchContainer}>
        <RN.View
          style={[
            styles.searchContent,
            {backgroundColor: appCtx.Colors.inputContainer},
          ]}>
          <RN.View style={[{marginLeft: 10}]}>
            <Search />
          </RN.View>
          <RN.TextInput
            style={styles.searchInput}
            onChangeText={onChangeText}
            value={text}
            placeholder={'搜尋商品描述'}
            textAlign="left"
            placeholderTextColor="gray"
          />
        </RN.View>
        <RN.TouchableOpacity
          style={[
            styles.searchContentText,
            {backgroundColor: appCtx.Colors.primary},
          ]}
          onPress={() => postSearchProduct()}>
          <RN.Text
            style={[styles.searchText, {color: appCtx.Colors.textPrimary}]}>
            搜尋
          </RN.Text>
        </RN.TouchableOpacity>
        <Fillter categoryValue={setCategoryValue} ShowDialog={setShowDialog} />
        <RN.TouchableOpacity
          style={[styles.addContainer]}
          onPress={() => {
            navigation.navigate('AddProductItem');
          }}>
          <RN.View
            style={[
              styles.itemContent,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            <Plus />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.ScrollView
        refreshControl={
          <RN.RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appCtx.Colors.primary]}
            tintColor={appCtx.Colors.primary}
            progressViewOffset={-5}
          />
        }>
        <RN.View style={styles.productContainer}>
          {product.length > 0 ? (
            product.map((item, index) => {
              return (
                <RN.TouchableOpacity
                  style={[
                    styles.itemContainer,
                    {backgroundColor: appCtx.Colors.proudcut.cardContianer},
                  ]}
                  onPress={() => navigation.navigate('ProductItem', {item})}
                  key={index}>
                  <RN.ImageBackground
                    source={{uri: `${item.imageUrl}`}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover">
                    <RN.View style={[styles.itemContentTextContainer]}>
                      <RN.View
                        style={[
                          styles.itemContentText,
                          {alignItems: 'flex-end'},
                        ]}>
                        <RN.Text
                          style={{
                            padding: 5,
                            color: appCtx.Colors.proudcut.cardTitleText,
                            width: '35%',
                            backgroundColor: appCtx.Colors.proudcut.cardTitle,
                          }}>
                          {item.category}
                        </RN.Text>
                      </RN.View>
                      <RN.View
                        style={[
                          styles.itemContentText,
                          {
                            backgroundColor:
                              appCtx.Colors.proudcut.cardContianer,
                            alignItems: 'center',
                          },
                        ]}>
                        <RN.Text
                          style={[
                            {
                              color: appCtx.Colors.proudcut.cardText,
                              flex: 6,
                              marginLeft: 15,
                            },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode={'tail'}>
                          {item.describe}
                        </RN.Text>
                        <RN.Text
                          style={[
                            {color: appCtx.Colors.proudcut.cardText, flex: 4},
                          ]}
                          numberOfLines={1}
                          ellipsizeMode={'tail'}>
                          {' '}
                          $ {Number(item.price)}
                        </RN.Text>
                      </RN.View>
                    </RN.View>
                  </RN.ImageBackground>
                </RN.TouchableOpacity>
              );
            })
          ) : (
            <RN.View style={styles.itemContainer}>
              <RN.View
                style={[
                  {
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    height: '100%',
                  },
                ]}>
                <RN.Text style={{fontSize: 20}}>
                  {searchText ? `搜尋 "${searchText}"  查無資料` : `尚無資料`}
                </RN.Text>
              </RN.View>
            </RN.View>
          )}
        </RN.View>
      </RN.ScrollView>
      <Pagination
        page={page}
        pagination={pagination}
        total={total}
        onPageChange={onPageChange}
      />
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
    flexWrap: 'wrap',
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
    alignContent: 'center',
  },
  itemContentTextContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: '100%',
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
    alignItems: 'center',
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
  addContainer: {
    width: '5%',
    margin: 10,
  },
});

export default Coupon;
