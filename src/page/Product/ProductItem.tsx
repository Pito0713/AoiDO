import React from 'react';
import * as RN from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFormik } from 'formik';
import { Picker } from '@react-native-picker/picker';

import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback';
import service from '../Service/service';
import { useAppSelector } from '../../redux/store';
import ImagePicker from '../../component/ImagePicker'
import Modal from '../../component/Modal';

interface Item {
  describe?: string,
  price?: string,
  remark?: string,
  quantity?: string,
}

const ProductItem = ({ route }: { route: any }) => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();

  // token
  const reduxToken = useAppSelector((state: { token: any; }) => state.token);

  const [init, setInit] = React.useState(false);
  const [photo, setPhoto] = React.useState(
    route.params?.item.imageUrl ? route.params.item.imageUrl : '',
  );
  const [originalPhoto, setOriginalPhoto] = React.useState(
    route.params?.item.imageUrl ? route.params.item.imageUrl : '',
  );
  const [category, setCategory] = React.useState('');
  const [categoryList, setCategoryList] = React.useState([]);

  const [modalOpen, setModalOpen] = React.useState(false);

  // Modal
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const postUploadProduct = async (values: Item) => {
    console.log(values)
    if (!['', null, undefined].includes(values?.describe) &&
      !['', null, undefined].includes(values?.price) &&
      !['', null, undefined].includes(values?.quantity)
    ) {
      await appCtx.setLoading(true);
      let target = originalPhoto !== photo ? await postUploadWebImage() : originalPhoto;

      if (target) {
        let submitData = {
          id: route.params.item._id,
          describe: values?.describe,
          category: category,
          price: values?.price,
          remark: values?.remark,
          token: reduxToken,
          imageUrl: target?.imageUrl,
          quantity: values?.quantity,
        };

        const response = await service.postUploadProduct(submitData);
        if (response?.status === 'success') navigation.goBack();
      }
      await appCtx.setLoading(false);
    }
  };

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: route.params?.item.describe ? route.params.item.describe : '',
      price: route.params?.item.price ? route.params.item.price : '',
      remark: route.params?.item.remark ? route.params.item.remark : '',
      quantity: route.params?.item.quantity ? route.params.item.quantity : '',
    },
    validate: (values: any) => {
      const regDecimalTo2 = /^\d+(\.\d{1,2})?$/;
      const regNumber = /^\d+$/;
      const errors: Item = {};

      // price
      if (values.price == 0) errors.price = '*' + '必須大於0';
      if (!regDecimalTo2.test(values.price)) errors.price = '*' + '必須數字且最多小數點後第2位';

      // quantity
      if (!regNumber.test(values.quantity)) errors.quantity = '*' + '必須數字';

      return errors;
    },
    onSubmit: async (values: Item, { resetForm }: any) => {
      postUploadProduct(values);
      resetForm();
      setCategory('');
      setPhoto('');
    },
  });

  // 更新網頁圖片
  const postUploadWebImage = async () => {
    let submitData = {
      image: photo
    }
    const response = await service.postUploadWebImage(submitData);
    if (response?.data) return response.data
  };

  // 刪除商品
  const deleteProductOne = async () => {
    let submitData = {
      id: route.params.item._id,
    };
    await appCtx.setLoading(true);
    const response = await service.deleteProductOne(submitData);
    await appCtx.setLoading(false);
    closeModal()
    if (response?.status === 'success') navigation.goBack();
  };

  // 搜尋分類
  const postProductFilter = async () => {
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter((item: any) => {
        return item.token !== '1';
      });
      setCategoryList(target);
    }
    setInit(false);
  };

  React.useEffect(() => {
    if (init) {
      postProductFilter();
      setCategory(
        route.params?.item.category ? route.params?.item.category : '',
      );
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

  return (
    <RN.View style={styles.itemContainer}>
      <Goback />
      <ImagePicker
        onValuechange={(e: string) => { setPhoto(e) }}
        photo={photo}
        width={'100%'}
        height={250}
      />
      <RN.View>
        <RN.Text style={styles.itemContainerText}>商品描述</RN.Text>
        <RN.TextInput
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
          value={formik.values.describe}
          onChangeText={formik.handleChange('describe')}
          placeholder="描述"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.describe as String}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>商品分類</RN.Text>
        <Picker
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
          selectedValue={category}
          onValueChange={(e: any) => { setCategory(e) }}>
          {categoryList.map((item: any, index: any) => (
            <Picker.Item
              key={index}
              value={item?.category}
              label={item?.category}
            />
          ))}
        </Picker>
        <RN.View>
          <RN.Text />
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>商品價格</RN.Text>
        <RN.TextInput
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
          value={formik.values.price}
          onChangeText={formik.handleChange('price')}
          placeholder="商品價格"
          keyboardType="phone-pad"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.price as String}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>商品數量</RN.Text>
        <RN.View
          style={{
            borderWidth: 1.5,
            borderRadius: 5,
            overflow: 'hidden',
            flexDirection: 'row',
          }}>
          <RN.TextInput
            style={[
              {
                backgroundColor: appCtx.Colors.inputContainer,
                flex: 7,
                paddingLeft: 15,
                height: 45,
              },
            ]}
            value={formik.values.quantity}
            onChangeText={formik.handleChange('quantity')}
            placeholder="商品數量"
            keyboardType="phone-pad"
          />
        </RN.View>
        <RN.View>
          <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.quantity as String}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>備註</RN.Text>
        <RN.TextInput
          style={[
            styles.input,
            { backgroundColor: appCtx.Colors.inputContainer },
          ]}
          value={formik.values.remark}
          onChangeText={formik.handleChange('remark')}
          placeholder="備註"
        />
        <RN.View>
          <RN.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.remark as String}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View style={styles.bottomGroup}>
        <RN.TouchableOpacity
          style={[
            styles.saveContainer,
            { backgroundColor: appCtx.Colors.primary },
          ]}
          onPress={() => formik.submitForm()}>
          <RN.Text style={[styles.saveContainerText]}>保存</RN.Text>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          style={[styles.saveContainer]}
          onPress={() => openModal()}>
          <RN.Text style={styles.saveContainerText}>刪除</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <Modal
        isOpen={modalOpen}
        confirm={() => deleteProductOne()}
        cancel={closeModal}
        content={'是否刪除'}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    paddingLeft: 15,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  itemContainerText: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  saveContainer: {
    flex: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
    marginTop: 20,
    margin: 10,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  saveContainerText: {
    textAlign: 'center',
  },
  picker: {
    paddingLeft: 15,
    height: 45,
    marginBottom: -20,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  bottomGroup: {
    flexDirection: 'row',
  },
});

export default ProductItem;
