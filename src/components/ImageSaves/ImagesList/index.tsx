import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  ImageList,
  ImageListItem,
  InputAdornment,
  TextField
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { useImages, useDestroyFiles } from 'src/hooks/useFileData';
import { useImageState } from 'src/contexts/ImageContext';
import { FileDataType } from 'src/models/fileData';
import ImageDialog from './ImageDialog';

const ImagesList = () => {
  const { t }: { t: any } = useTranslation();
  const { getImages } = useImages();
  const { loading: destroyLoading, destroyFiles } = useDestroyFiles();
  const { imageList } = useImageState();
  const [selectImageIds, setSelectImageIds] = useState<number[]>([]);
  const [selectImage, setSelectImage] = useState<FileDataType>();
  const [open, setOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const handleChangeSelectImage = useCallback(
    (image: FileDataType) => setSelectImage(image),
    []
  );

  const handleAddSelectImageIds = useCallback(
    (id: number) => setSelectImageIds((prev) => [...prev, id]),
    []
  );
  const handleRemoveSelectImageIds = useCallback(
    (id: number) => setSelectImageIds((prev) => prev.filter((n) => n !== id)),
    []
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectModeOn = () => setSelectMode(true);
  const handleSelectModeOff = () => setSelectMode(false);

  useEffect(() => {
    getImages();
  }, []);

  return (
    <>
      <Box p={2} sx={{ display: 'flex', paddingBottom: 0 }}>
        {!selectMode ? (
          <>
            <TextField
              sx={{
                m: 0
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              placeholder={t('Search by file name')}
              size="small"
              margin="normal"
              variant="outlined"
            />
            <Autocomplete
              sx={{
                mx: 2,
                width: '160px'
              }}
              size="small"
              options={['2020年3月']}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button variant="contained" onClick={handleSelectModeOn}>
              {t('Bulk select')}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="error"
              startIcon={
                destroyLoading ? (
                  <CircularProgress size="1rem" />
                ) : (
                  <DeleteTwoToneIcon />
                )
              }
              onClick={() =>
                destroyFiles(selectImageIds, () => handleSelectModeOff())
              }
            >
              {t('Bulk delete')}
            </Button>
          </>
        )}
      </Box>
      <ImageList sx={{ height: 450 }} cols={12} rowHeight={100}>
        {imageList.map((image) => (
          <ImageListItem
            key={image.id}
            sx={{ height: '100px', width: '100px', p: 1, pt: 2 }}
            onClick={() => {
              if (selectMode) {
                if (!selectImageIds.includes(image.id))
                  handleAddSelectImageIds(image.id);
                else handleRemoveSelectImageIds(image.id);
              } else {
                setSelectImage(image);
                handleOpen();
              }
            }}
          >
            {selectMode && selectImageIds.includes(image.id) && (
              <Badge
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                badgeContent={
                  <CheckIcon
                    style={{
                      fontSize: 25,
                      color: 'red'
                    }}
                  />
                }
              />
            )}
            <img
              src={`${image.thumbnailUrl}`}
              alt={image.name}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
        <ImageDialog
          image={selectImage}
          handleChangeSelectImage={handleChangeSelectImage}
        />
      </Dialog>
    </>
  );
};

export default ImagesList;
