import React from 'react';
import * as RN from 'react-native';
import service from '../Service/service';
import { AppContext } from '../../redux/AppContent';
import Goback from '../../component/Goback'
import ReminderText from '../../component/ReminderText';
import TitleText from '../../component/TitleText';
import { Checkbg, Cancel } from '../../assets';
import ImagePicker from '../../component/ImagePicker'
import { useFocusEffect } from '@react-navigation/native';

const Content = () => {
  const appCtx = React.useContext(AppContext);
  interface submitData {
    id?: string | undefined,
    _id?: string | undefined,
    img?: string | undefined,
    isActive?: boolean | undefined,
  }

  // 初始化
  const [init, setInit] = React.useState(false);

  const [photoList, setPhotoList] = React.useState([]);
  const [photo, setPhoto] = React.useState('');

  // Modal
  const openModal = (_id: string | undefined) => {
    appCtx.setModalOpen(true);
    appCtx.setModal({
      onConfirm: () => { deleteOneMainImg(_id), appCtx.setModalOpen(false); },
      content: '是否刪除'
    });
  };

  const handleUploadPhoto = async () => {
    let submitData = {
      image: photo
    }
    const response = await service.postUploadWebImage(submitData);
    if (response?.data) return response.data
  };

  // 新增大綱照片
  const postCreateMainImg = async () => {
    await appCtx.setLoading(true);
    let target = await handleUploadPhoto()

    if (target) {
      let submitData = {
        img: target.imageUrl,
        // 直接帶入未啟動狀態
        isActive: false
      }

      if (submitData.img) {
        const response = await service.postCreateMainImg(submitData);
        if (response?.status === 'success') {
          // 成功後重整
          getFindAllMainImg()
        }
      }
    }
    await appCtx.setLoading(false);
  };

  // 取得大綱照片
  const getFindAllMainImg = async () => {
    await appCtx.setLoading(true);

    const response = await service.getFindAllMainImg();

    if (response?.status === 'success') {
      setPhotoList(response.data);
      setPhoto('')
    }
    await appCtx.setLoading(false);
  };

  // 刪除大綱照片
  const deleteOneMainImg = async (_id: string | undefined) => {
    let submitData = {
      id: _id,
    };
    await appCtx.setLoading(true);
    const response = await service.deleteOneMainImg(submitData);
    // 成功後重整
    if (response?.status === 'success') getFindAllMainImg();

    await appCtx.setLoading(false);
  };

  // 更新大綱照片
  const patchUploadMainImg = async (item: submitData) => {
    let submitData = {
      id: item._id,
      isActive: !item.isActive
    };
    await appCtx.setLoading(true);
    const response = await service.patchUploadMainImg(submitData);

    // 成功後重整
    if (response?.status === 'success') getFindAllMainImg();
    await appCtx.setLoading(false);
  };

  const onValueChange = (e: any) => {
    setPhoto(e)
  }

  React.useEffect(() => {
    if (init) {
      getFindAllMainImg()
    }
  }, [init]);

  useFocusEffect(
    // 監聽頁面離開與載入
    React.useCallback(() => {
      // 開始初始化
      setInit(true);
      return () => {
        setInit(false);
        setPhotoList([]);
        setPhoto('')
      }
    }, [])
  );

  return (
    <RN.View style={styles.container}>
      <RN.View style={{ margin: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <ImagePicker onValueChange={onValueChange} photo={photo} width={200} height={200} />
        <RN.View style={[styles.listContainer]}>
          <ReminderText text={'* 點擊後選擇圖片, 圖片大小 只能用20KB'} />
          <ReminderText text={'* 需點選上傳, 更新至資源區'} />
          {photo && <RN.View style={[styles.addContainer, { backgroundColor: appCtx.Colors.photo.cardBottom }]}>
            <RN.TouchableOpacity style={[{ alignItems: 'center', justifyContent: 'center' }]} onPress={postCreateMainImg}>
              <RN.Text>{"上傳"}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>}
        </RN.View>
      </RN.View>
      <RN.View style={[styles.titleContainer]}>
        <TitleText text={'圖片資源區'} />
      </RN.View>
      <RN.View style={[styles.listContainer]}>
        <ReminderText text={'* 點擊圖片可啟用或取消'} />
        <ReminderText text={'* 啟用後, 顯示於首頁'} />
        <ReminderText text={'* 點擊X 可刪除圖片'} />
      </RN.View>
      <RN.View style={styles.photoContainer}>
        {(photoList?.length > 0 && Array.isArray(photoList)) ? (
          photoList.map((item: submitData, index: any) => {
            return (
              <RN.View >
                <RN.TouchableOpacity
                  style={{ margin: 10 }}
                  onPress={() => openModal(item._id)}
                >
                  <Cancel />
                </RN.TouchableOpacity>
                <RN.TouchableOpacity
                  style={[
                    styles.itemContainer,
                    { backgroundColor: appCtx.Colors.photo.cardContainer },
                  ]}
                  onPress={() => patchUploadMainImg(item)}
                  key={index}>
                  <RN.ImageBackground
                    source={{ uri: `${item.img}` }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover">
                    {item.isActive ? <Checkbg
                    /> : <RN.View />}
                  </RN.ImageBackground>
                </RN.TouchableOpacity>
              </ RN.View>
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
              <RN.Text style={{ fontSize: 20 }}>{'暫無資料'}</RN.Text>
            </RN.View>
          </RN.View>
        )}
      </RN.View>
    </RN.View>
  );
};


const MainImg = () => {
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
  photoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    flexWrap: 'wrap',
  },
  itemContainer: {
    height: 200,
    width: 200,
    marginBottom: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    borderRadius: 15,
  },
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  addContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 50,
    width: 80,
    marginLeft: 10,
    marginBottom: 10,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  addContent: {
    height: 200,
    width: 200,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    borderRadius: 15,
    margin: 10,
  },
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 20,
    flexWrap: 'wrap',
  },
});

export default MainImg;
