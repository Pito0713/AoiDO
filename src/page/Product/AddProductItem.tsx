import React from "react";
import * as RN from 'react-native';
import { useFormik } from "formik";
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import service from "../Service/service";
import { useAppSelector } from '../../redux/store';
import ImagePicker from '../../component/ImagePicker'

interface Item {
  describe?: string,
  price?: string,
  category?: string,
  remark?: string,
  quantity?: string,
}

interface CategoryItem {
  label?: string,
  value?: string,
}
const AddProductItem = () => {
  type Nav = {
    navigate: (route: string | undefined ,params:{isGo:boolean}) => void,
    goBack: () => void,
  }
  const appCtx = React.useContext(AppContext);

  const navigation = useNavigation<Nav>();
  const reduxToken = useAppSelector((state: { token: any; }) => state.token)

  const [category, setCategory] = React.useState('');
  const [photo, setPhoto] = React.useState('');
  const [categoryList, setCategoryList] = React.useState([]);

  const save = async (values: Item) => {
    if (values?.describe && values?.price && values?.quantity) {
      let target = await handleUploadPhoto()
      let submitData = {
        "describe": values.describe,
        "price": values.price,
        "quantity": values.quantity,
        "remark": values.remark,
        "category": category,
        "token": reduxToken,
        "imageUrl": target?.imageUrl,
      }
      if (target.imageUrl) {
        await appCtx.setLoading(true);
        const response = await service.postAddProduct(submitData);
        if (response?.status === 'success') navigation.goBack()
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
    validate: (values: { describe: any; price: string; quantity: string; }) => {
      const regDecimalto2 = /^\d+(\.\d{1,2})?$/
      const regNumber = /^\d+$/
      const errors: Item = {};

      if (!values.describe) errors.describe = '*' + '必填';
      if (!regDecimalto2.test(values.price)) errors.price = '*' + "必須數字且最多小數點後第2位";
      if (!regNumber.test(values.quantity)) errors.quantity = '*' + "必須數字";

      return errors;
    },
    onSubmit: async (values: Item, { resetForm }: any) => {
      save(values)
      resetForm()
      setCategory('')
      setPhoto('')
    },
  });


  const handleUploadPhoto = async () => {
    let submitData = {
      image: photo
    }
    const response = await service.postUploadWebImage(submitData);
    if (response?.data) return response.data
  };

  const postProductFilter = async () => {
    const response = await service.postProductFilter();
    if (!['', null, undefined].includes(response?.data)) {
      let target = response?.data.filter(( item:any )=>{
        return item.token !== '1'
      })
      setCategoryList(target)
    }
  }

  const onValueChange = (e: any) => {
    setPhoto(e)
  }


  React.useEffect(() => {
    postProductFilter()
  }, []);

  return (
    <RN.View style={styles.itemContainer}>
      <Goback />
      <ImagePicker onValuechange={onValueChange} photo={photo} width={'100%'} height={250}/>
        <RN.View>
          <RN.Text style={styles.itemContainerText}>商品描述</RN.Text>
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
          <RN.Text style={styles.itemContainerText}>商品分類</RN.Text>
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
          <RN.Text style={styles.itemContainerText}>商品價格</RN.Text>
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
              onPress={() => navigation.navigate('transfer', { isGo: true } )}
            >
              <RN.Text style={[{ color: appCtx.Colors.textPrimary }]}>換算</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View >
            <RN.Text style={[, { color: appCtx.Colors.errorText, fontSize: 12 }]}>
              {formik.errors.price}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View >
          <RN.Text style={styles.itemContainerText}>商品數量</RN.Text>
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
          <RN.Text style={styles.itemContainerText}>備註</RN.Text>
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
            <RN.Text style={styles.saveContainerText}>保存</RN.Text>
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