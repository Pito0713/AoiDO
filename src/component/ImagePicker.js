import React, { useCallback } from 'react';
import * as RN from 'react-native';
import Dropzone from 'react-dropzone';
import { Plus } from '../assets';
import { AppContext } from '../redux/AppContent';

const ImagePicker = imageValue => {
  const appCtx = React.useContext(AppContext);
  const handleDrop = useCallback(async acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];

      if (!['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        appCtx.setModalOpen(true);
        appCtx.setModal({
          content: '圖片規格有誤 只能用jpg, jpeg, png, gif'
        });
        return;
      }
      if (file.size > 20000) {
        appCtx.setModalOpen(true);
        appCtx.setModal({
          content: '圖片大小 只能用20KB'
        });
        return;
      }
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

      try {
        const base64 = await toBase64(file);
        imageValue.onValuechange(base64);
      } catch (error) { }
    }
  });


  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <RN.View
          {...getRootProps()}
          style={{
            width: imageValue.width,
            height: imageValue.height,
            borderWidth: 1.5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            overflow: 'hidden',
            marginTop: 20,
          }}>
          <input {...getInputProps()} />

          {!['', {}, null, undefined].includes(imageValue.photo) ? (
            <img
              src={imageValue.photo}
              alt="Uploaded"
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Plus />
          )}
        </RN.View>
      )}
    </Dropzone>
  );
};

export default ImagePicker;
