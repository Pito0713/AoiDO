import React from 'react';
import * as RN from 'react-native';
import service from '../Service/service';
import {AppContext} from '../../redux/AppContent';
import Goback from '../../component/Goback'
import ReminderText from '../../component/ReminderText';
import Checkbg from '../../assets/Checkbg';
import Cancel from '../../assets/Cancel';
import ImagePicker from '../../component/ImagePicker'
import Modal from '../../component/Modal';

const Content = () => {
  const appCtx = React.useContext(AppContext);

  interface submitData {
    id?: string  | undefined,
    _id?: string | undefined,
    img?: string  | undefined,
    isActive?: boolean | undefined,
  }

  const [photoList, setPhotoList] = React.useState([]);
  const [photo, setPhoto] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('');

  const openModal = (item:any) => {
    setModalOpen(true);
    setDeleteId(item)
  };

  const closeModal = () => {
    setModalOpen(false);
    setDeleteId('')
  };

  const handleUploadPhoto = async () => {
    let submitData = {
      image: photo
    }
    const response = await service.postUploadWebImage(submitData);
    if (response?.data) return response.data
  };

  const postCreateCarouselImg = async () => {
    await appCtx.setLoading(true);
    let target = await handleUploadPhoto()

    if (target) {
      let submitData = {
        img: target.imageUrl,
        isActive: false
      }

      if(submitData.img) {
        const response = await service.postCreateCarouselImg(submitData);
        if (response?.status === 'success') {
          getfindAllCarouselImg()
        }
      }
    }
    await appCtx.setLoading(false);
  };

  const getfindAllCarouselImg = async () => {
    await appCtx.setLoading(true);

    const response = await service.getFindAllCarouselImg();

    if (response?.status === 'success') {
      setPhotoList(response.data);
      setPhoto('')
    }
    await appCtx.setLoading(false);
  };

  const deleteOneCarouselImg = async () => {
    let submitData = {
      id: deleteId,
    };
    await appCtx.setLoading(true);
    const response = await service.deleteOneCarouselImg(submitData);
    if (response?.status === 'success') getfindAllCarouselImg();
    closeModal()
    await appCtx.setLoading(false);
  };

  const patchUploadCarouselImg = async (item: submitData) => {
    let submitData = {
      id: item._id,
      isActive: !item.isActive
    };
    await appCtx.setLoading(true);
    const response = await service.patchUploadCarouselImg(submitData);
    if (response?.status === 'success') getfindAllCarouselImg();
    await appCtx.setLoading(false);
  };

  const onValueChange = (e: any) => {
    setPhoto(e)
  }

  React.useEffect(() => {
    getfindAllCarouselImg();
  }, []);

  return (
    <RN.View>
      <RN.View style={[styles.addContainer ,{backgroundColor: appCtx.Colors.photo.cardBottom}]}>
        <RN.TouchableOpacity style={[{alignItems: 'center', justifyContent: 'center'}]} onPress={postCreateCarouselImg}>
          <RN.Text>上傳</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View style={{margin: 10}}>
        <ImagePicker onValuechange={onValueChange} photo={photo} width={200} height={200}/>
      </RN.View>
      <RN.View style={[styles.listContainer]}>
        <ReminderText text={'* 長按圖片可刪除'} />
        <ReminderText text={'* 點擊圖片可啟用或取消'} />
      </RN.View>
      <RN.View style={styles.photoContainer}>
        {photoList.length > 0 ? (
          photoList.map((item:submitData, index: any) => {
            return (
              <RN.View >
                <RN.TouchableOpacity
                  style={{margin: 10}}
                  onPress={() => openModal(item._id)}
                >
                  <Cancel />
                </RN.TouchableOpacity>
                <RN.TouchableOpacity
                  style={[
                    styles.itemContainer,
                    {backgroundColor: appCtx.Colors.photo.cardContianer},
                  ]}
                  onPress={() => patchUploadCarouselImg(item)}
                  key={index}>
                  <RN.ImageBackground
                    source={{uri: `${item.img}`}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover">
                    { item.isActive ? <Checkbg
                    />: <RN.View /> }
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
              <RN.Text style={{fontSize: 20}}>暫無資料</RN.Text>
            </RN.View>
          </RN.View>
        )}
      </RN.View>
      <Modal
        isOpen={modalOpen}
        confirm={() => deleteOneCarouselImg()}
        cancel={closeModal}
        content={'是否刪除'}
      />
    </RN.View>
  );
};


const CarouselImg = () => {
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
    marginLeft: 10,
    marginRight: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
});

export default CarouselImg;
