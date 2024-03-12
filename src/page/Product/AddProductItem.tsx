import React from "react";
import * as RN from 'react-native';
import { useFormik } from "formik";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// api
import service from "../Service/service";
// redux
import { AppContext } from '../../redux/AppContent';
// com
import ImagePicker from '../../component/ImagePicker'
import Goback from '../../component/Goback'

// type
interface Item {
  describe?: string,
  price?: string,
  category?: string,
  remark?: string,
  quantity?: string,
}

const AddProductItem = () => {
  type Nav = {
    navigate: (route: string | undefined, params: { isGo: boolean }) => void,
    goBack: () => void,
  }
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation<Nav>();

  const [category, setCategory] = React.useState('');
  const [photo, setPhoto] = React.useState('');
  const [categoryList, setCategoryList] = React.useState([]);

  // 新增商品
  const postAddProduct = async (values: Item) => {
    if (values?.describe && values?.price && values?.quantity) {
      await appCtx.setLoading(true);
      // 上傳圖片到img
      let target
      target = await postUploadWebImage()
      let submitData = {
        "describe": values.describe,
        "price": values.price,
        "quantity": values.quantity,
        "remark": values.remark,
        "category": category,
        "imageUrl": target?.imageUrl,
      }

      if (!['', null, undefined].includes(target?.imageUrl)) {
        const response = await service.postAddProduct(submitData);

        // 成功 返回上一頁
        if (response?.status === 'success') navigation.goBack()
      } else {
        // 圖片網址失敗
        appCtx.setModalOpen(true);
        appCtx.setModal({
          content: '圖片資源錯誤'
        });
      }
      await appCtx.setLoading(false);
    }
  }

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      describe: "",
      price: "",
      remark: "",
      quantity: "",
    },
    validate: (values: { describe: string; price: string; quantity: string; }) => {
      const regDecimalTo2 = /^\d+(\.\d{1,2})?$/
      const regNumber = /^\d+$/

      const errors: Item = {};

      if (!values.describe) errors.describe = '*' + '必填';
      if (!regDecimalTo2.test(values.price)) errors.price = '*' + "必須數字且最多小數點後第2位";
      if (!regNumber.test(values.quantity)) errors.quantity = '*' + "必須數字";

      return errors;
    },
    onSubmit: async (values: Item, { resetForm }: any) => {
      postAddProduct(values)
      resetForm()
      setCategory('')
      setPhoto('')
    },
  });
  0
  // 更新網頁圖片
  const postUploadWebImage = async () => {
    if (!['', null, undefined].includes(photo)) {
      let submitData = {
        image: photo
      }
      // 圖片上傳功能
      const response = await service.postUploadWebImage(submitData);
      if (response?.data) return response.data
    } else {
      appCtx.setModalOpen(true);
      appCtx.setModal({
        content: '你少了圖片'
      });
    }
  };

  // 搜尋分類
  const postProductFilter = async () => {
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = []
      target = response?.data.filter((item: any) => {
        //  移除 權限 1
        return item?.token !== '1'
      })

      if (target?.length > 0) setCategory(target[0]?.category)
      setCategoryList(target)
    }
  }

  React.useEffect(() => {
    postProductFilter()
  }, []);

  return (
    <RN.View style={styles.itemContainer}>
      <Goback />
      <ImagePicker onValueChange={(e: string) => { setPhoto(e) }} photo={photo} width={'100%'} height={250} />
      <RN.View>
        <RN.Text style={styles.itemContainerText}>{'商品描述'}</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          value={formik.values.describe}
          onChangeText={formik.handleChange("describe")}
          placeholder="描述"
        />
        <RN.View>
          <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.describe}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>{'商品分類'}</RN.Text>
        <Picker
          style={[{
            backgroundColor: appCtx.Colors.inputContainer,
            width: '100%',
            paddingLeft: 15,
            height: 45,
            borderWidth: 1.5,
            borderRadius: 5
          }]}
          selectedValue={category}
          onValueChange={(e: any) => { setCategory(e) }}
        >
          {categoryList.map((item: any, index: any) => (
            <Picker.Item key={index} value={item?.category} label={item?.category} />
          ))}
        </Picker>
      </RN.View>
      <RN.View >
        <RN.Text style={styles.itemContainerText}>{'商品價格'}</RN.Text>
        <RN.View style={{ borderWidth: 1.5, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' }}>
          <RN.TextInput
            style={[{ backgroundColor: appCtx.Colors.inputContainer, flex: 7, paddingLeft: 15, height: 45, }]}
            value={formik.values.price}
            onChangeText={formik.handleChange("price")}
            placeholder="商品價格"
            keyboardType="phone-pad"
          />
          <RN.TouchableOpacity
            style={[styles.transferContainer, { backgroundColor: appCtx.Colors.primary, flex: 3 }]}
            onPress={() => navigation.navigate('transfer', { isGo: true })}
          >
            <RN.Text style={[{ color: appCtx.Colors.textPrimary }]}>{'換算'}</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
        <RN.View >
          <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.price}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View >
        <RN.Text style={styles.itemContainerText}>{'商品數量'}</RN.Text>
        <RN.View style={{ borderWidth: 1.5, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' }}>
          <RN.TextInput
            style={[{ backgroundColor: appCtx.Colors.inputContainer, flex: 7, paddingLeft: 15, height: 45, }]}
            value={formik.values.quantity}
            onChangeText={formik.handleChange("quantity")}
            placeholder="商品數量"
            keyboardType="phone-pad"
          />
        </RN.View>
        <RN.View >
          <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.quantity}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.Text style={styles.itemContainerText}>{'備註'}</RN.Text>
        <RN.TextInput
          style={[styles.input, { backgroundColor: appCtx.Colors.inputContainer, }]}
          value={formik.values.remark}
          onChangeText={formik.handleChange("remark")}
          placeholder="備註"
        />
        <RN.View >
          <RN.Text style={[{ color: appCtx.Colors.errorText, fontSize: 12 }]}>
            {formik.errors.remark}
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.View>
        <RN.TouchableOpacity style={[styles.saveContainer, { backgroundColor: appCtx.Colors.primary }]} onPress={() => formik.submitForm()}>
          <RN.Text style={styles.saveContainerText}>{'保存'}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
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
    marginBottom: 40,
  },
  input: {
    paddingLeft: 15,
    height: 45,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  itemContainerText: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 5
  },
  saveContainer: {
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
    marginTop: 40,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  saveContainerText: {
    textAlign: 'center'
  },
  transferContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    paddingLeft: 15,
    height: 45,
    marginBottom: -20,
    borderWidth: 1.5,
    borderRadius: 5,
  }
});

export default AddProductItem;