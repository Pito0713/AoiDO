import React from 'react';
import * as RN from 'react-native';
import { AppContext } from '../redux/AppContent';
import service from '../page/Service/service';
import { useFocusEffect } from '@react-navigation/native';
import ReminderText from './ReminderText';

import { Filter, Cancel } from '../assets';

const FilterContent = e => {
  const appCtx = React.useContext(AppContext);
  // 初始化
  const [init, setInit] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);

  // 搜尋分類
  const postProductFilter = async () => {
    // call api
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter(item => {
        return item.token !== '1';
      });
      target.forEach(item => {
        item.checked = false;
      });
      setCategoryList(target);
    }
  };


  React.useEffect(() => {
    if (init) {
      postProductFilter()
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
        setCategoryList([]);
        setShowDialog(false);
      }
    }, [])
  );

  const show = () => {
    setShowDialog(!showDialog);
    e.ShowDialog(!showDialog);
  };

  const handleCheckBoxChange = itemId => {
    const updatedData = categoryList.map(item =>
      item.category === itemId ? { ...item, checked: !item.checked } : item,
    );
    setCategoryList(updatedData);
    e.categoryValue(updatedData);
  };

  const renderItem = ({ item }) => (
    <RN.View style={styles.itemContainer}>
      <RN.CheckBox
        value={item.checked}
        onValueChange={() => handleCheckBoxChange(item.category)}
      />
      <RN.Text style={styles.checkBoxText}>{item.category}</RN.Text>
    </RN.View>
  );

  return (
    <RN.View style={styles.container}>
      <RN.TouchableOpacity onPress={() => show()}>
        <Filter />
      </RN.TouchableOpacity>
      <RN.Modal
        animationType="slide"
        style={styles.dialog}
        visible={showDialog}>
        <RN.TouchableOpacity style={styles.cleanFilter} onPress={() => show()}>
          <Cancel />
        </RN.TouchableOpacity>

        <RN.View>
          <RN.View
            style={[
              styles.listContainer,
              { borderColor: appCtx.Colors.Platform.borderPrimary },
            ]}>
            <ReminderText text={'* 勾選大類進行篩選'} />
            <ReminderText text={'* 可複選'} />
          </RN.View>
          <RN.FlatList
            data={categoryList}
            renderItem={renderItem}
            keyExtractor={item => item.category}
          />
          <RN.TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: appCtx.Colors.primary },
            ]}
            onPress={() => {
              setShowDialog(false);
              e.ShowDialog(false);
            }}>
            <RN.Text style={[{ color: appCtx.Colors.textPrimary, fontSize: 17.5, }]}>{'確認'}</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.Modal>
    </RN.View>
  );
};
const width = RN.Dimensions.get('window').width;

const styles = RN.StyleSheet.create({
  container: {
    margin: 15,
    flexDirection: 'row-reverse',
  },
  dialog: {
    backgroundColor: '#ffffff',
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dialogContent: {
    width: width / 2 - 40,
    padding: 15,
  },
  confirmButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: '30%',
  },
  cleanFilter: {
    marginHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10
  },
  checkBoxText: {
    fontSize: 20,
    marginLeft: 10,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
});

export default FilterContent;
