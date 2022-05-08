import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';
import { FileDataType, getImageFileTypes, PDF } from 'src/models/fileData';
import { useImageDispatch, setImageList } from 'src/contexts/ImageContext';

export const useImages = () => {
  const [loading, setLoading] = useState(false);
  const dispatchImage = useImageDispatch();

  const getImages = useCallback(() => {
    try {
      setLoading(true);
      request({
        url: '/v1/file_data/images',
        method: 'GET',
        reqParams: {
          params: {
            file_types: getImageFileTypes()
          }
        }
      })
        .then((response) => {
          dispatchImage(
            setImageList(response.data.images, response.data.totalCount)
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  }, [dispatchImage]);

  return { loading, getImages };
};

export const useFile = () => {
  const [file, setFile] = useState<FileDataType>();
  const { getImages } = useImages();

  const putFile = (id: number, data: FileDataType) =>
    useCallback(() => {
      try {
        request({
          url: `/v1/file_data/${id}`,
          method: 'PUT',
          reqParams: {
            data
          }
        }).then((response) => {
          setFile(response.data.fileData);
          if (data.fileType !== PDF) {
            getImages();
          }
        });
      } catch (e) {
        console.error(e);
      }
    }, []);

  return { file, putFile };
};

export const useAllCapacity = () => {
  const [usingRate, setUsingRate] = useState(0);
  const [capacityMessage, setCapacityMessage] = useState('ストレージ余裕あり');
  const [gaugeColor, setGaugeColor] = useState<
    | 'success'
    | 'white'
    | 'info'
    | 'warning'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'trueWhite'
  >('success');

  const getAllCapacity = useCallback(() => {
    try {
      request({
        url: '/v1/file_data/all_capacity',
        method: 'GET'
      }).then((response) => {
        setUsingRate(response.data.usingRate);
        setCapacityMessage(
          `ストレージ余裕なし \n ${response.data.allCapacity}GB / 5GB 使用中`
        );

        if (response.data.usingRate >= 90) {
          setGaugeColor('error');
        } else if (response.data.usingRate > 75) {
          setGaugeColor('warning');
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { usingRate, capacityMessage, gaugeColor, getAllCapacity };
};

export const usePostFiles = () => {
  const [successFiles, setSuccessFiles] = useState<File[]>([]);
  const { getAllCapacity } = useAllCapacity();
  const { getImages } = useImages();

  const postFiles = useCallback((files: File[], successCallback = null) => {
    const data = new FormData();
    files.forEach((file: File) => data.append('images[]', file));

    try {
      request({
        url: '/v1/file_data',
        method: 'POST',
        reqParams: {
          data
        }
      })
        .then(() => {
          setSuccessFiles(files);
          getAllCapacity();
          getImages();
        })
        .catch((error) => {
          console.error(error.response);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { successFiles, postFiles };
};

export const useDestroyFiles = () => {
  const [loading, setLoading] = useState(false);
  const { getImages } = useImages();

  const destroyFiles = (ids: number[], successCallback = null) => {
    try {
      setLoading(true);
      request({
        url: '/v1/file_data/bulk',
        method: 'DELETE',
        reqParams: {
          data: {
            ids
          }
        }
      })
        .then(() => {
          getImages();
          if (successCallback) successCallback();
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  };

  return { loading, destroyFiles };
};
