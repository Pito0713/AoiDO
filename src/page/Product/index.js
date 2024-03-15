import React from 'react';
import * as RN from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// svg element
import { Search, Plus } from '../../assets'

// redux
import { AppContext } from '../../redux/AppContent';

import service from '../Service/service';
import Filter from '../../component/Filter';
import Pagination from '../../component/Pagination';
import ReminderText from '../../component/ReminderText';

const windowWidth = RN.Dimensions.get('window').width;
const windowHeight = RN.Dimensions.get('window').height;

const Product = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();

  const [init, setInit] = React.useState(false);
  const [text, onChangeText] = React.useState('');
  const [categoryValue, setCategoryValue] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState(10);
  const [productData, setProductData] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const onPageChange = page => {
    setPage(page);
  };

  // 搜尋全部商品
  const postAllProduct = async () => {
    let target = [];
    target = categoryValue
      .filter(item => {
        return item.checked === true;
      })
      .map(element => {
        return element.category;
      });

    let submitData = {
      searchText: text,
      category: target,
      page: page,
      pagination: pagination,
    };
    await appCtx.setLoading(true);
    const response = await service.postAllProduct(submitData);

    if (response?.status === 'success') {
      setSearchText(text);
      setProductData(response.data);
      setTotal(response.total);
    } else {
      setSearchText(text);
      setProductData([]);
      setTotal(0);
    }
    // 初始化關閉
    setInit(false)
    await appCtx.setLoading(false);
  };

  React.useEffect(() => {
    if (init) {
      postAllProduct();
      setPage(1)
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
      }
    }, [])
  );

  React.useEffect(() => {
    if (!showDialog && page > 1) onPageChange(1);
    if (!showDialog && page == 1) postAllProduct();
  }, [showDialog]);

  React.useEffect(() => {
    postAllProduct();
  }, [page]);

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.searchContainer}>
        <RN.View
          style={[
            styles.searchContent,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}>
          <RN.View style={[{ marginLeft: 10 }]}>
            <Search />
          </RN.View>
          <RN.TextInput
            style={styles.searchInput}
            onChangeText={(e) => {
              onChangeText(e)
            }}
            value={text}
            placeholder={'搜尋商品描述'}
            textAlign="left"
            placeholderTextColor="gray"
          />
        </RN.View>
        <RN.TouchableOpacity
          style={[
            styles.searchContentText,
            { backgroundColor: appCtx.Colors.primary },
          ]}
          onPress={() => postAllProduct()}>
          <RN.Text style={[styles.searchText, { color: appCtx.Colors.textPrimary }]}>
            {'搜尋'}
          </RN.Text>
        </RN.TouchableOpacity>
        <Filter categoryValue={setCategoryValue} ShowDialog={setShowDialog} />
        <RN.TouchableOpacity
          style={[styles.addContainer]}
          onPress={() => {
            navigation.navigate('AddProductItem');
          }}>
          <RN.View
            style={[
              styles.itemContent,
              { alignItems: 'center', justifyContent: 'center' },
            ]}>
            <Plus />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={[styles.listContainer]}>
        <ReminderText text={'* 右側按鈕 + 可新增商品 '} />
        <ReminderText text={'* 右側篩選按鈕可分類大類商品 '} />
        <ReminderText text={'* 點擊圖片可進入詳情頁'} />
        <ReminderText text={'* 搜尋框可進行模糊搜尋'} />
      </RN.View>

      <RN.ScrollView>
        <RN.View style={styles.productContainer}>
          {productData?.length > 0 ? (
            productData.map((item, index) => {
              return (
                <RN.TouchableOpacity
                  style={[
                    styles.itemContainer,
                    { backgroundColor: appCtx.Colors.product.cardContainer },
                  ]}
                  onPress={() => navigation.navigate('ProductItem', { item })}
                  key={index}>
                  <RN.ImageBackground
                    source={{ uri: `${item.imageUrl}` }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover">
                    <RN.View style={[styles.itemContentTextContainer]}>
                      <RN.View
                        style={[
                          styles.itemContentText,
                          { alignItems: 'flex-end' },
                        ]}>
                        {item?.category ? <RN.Text
                          style={{
                            padding: 5,
                            color: appCtx.Colors.product.cardTitleText,
                            width: '45%',
                            backgroundColor: appCtx.Colors.product.cardTitle,
                          }}>
                          {item?.category}
                        </RN.Text> :
                          <RN.View />}
                      </RN.View>
                      <RN.View
                        style={[
                          styles.itemContentText,
                          {
                            backgroundColor: appCtx.Colors.product.cardContainer,
                            alignItems: 'center',
                          },
                        ]}>
                        <RN.Text
                          style={[
                            {
                              color: appCtx.Colors.product.cardText,
                              flex: 6,
                              marginLeft: 15,
                              fontSize: 20,
                              paddingVertical: 5
                            },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode={'tail'}>
                          {item.describe}
                        </RN.Text>
                        <RN.Text
                          style={[
                            {
                              color: appCtx.Colors.product.cardText,
                              flex: 4,
                              fontSize: 20,
                              paddingVertical: 5
                            },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode={'tail'}>
                          {`$ ${Number(item.price)}`}
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
                <RN.Text style={{ fontSize: 20 }}>
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
    </RN.View>
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
    height: 200,
    width: 200,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    alignItems: 'center',
    borderRadius: 10,
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
    width: windowWidth - 15,
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
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
});

export default Product;
