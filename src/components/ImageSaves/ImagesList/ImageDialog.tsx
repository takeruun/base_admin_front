import { FC, memo, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Typography,
  TextField,
  IconButton,
  useTheme
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import request from 'src/hooks/useRequest';
import { FileDataType } from 'src/models/fileData';
import { FontRateContext } from 'src/theme/ThemeProvider';
import { useImageDispatch, updateImage } from 'src/contexts/ImageContext';

interface ImageDialogPropsType {
  image: FileDataType;
  handleChangeSelectImage: (image: FileDataType) => void;
}

type FormInputType = {
  description: string;
};

const ImageDialog: FC<ImageDialogPropsType> = memo(
  ({ image, handleChangeSelectImage }) => {
    const { t }: { t: any } = useTranslation();
    const dispatchImage = useImageDispatch();

    const theme = useTheme();
    const getFontRate = useContext(FontRateContext);
    const fontRate = getFontRate();
    const [editing, setEditing] = useState(false);

    const handleEdit = () => setEditing(true);
    const handleEditClose = () => setEditing(false);

    const {
      control,
      handleSubmit,
      setValue,
      formState: { isSubmitting }
    } = useForm<FormInputType>({
      defaultValues: {
        description: ''
      }
    });

    const onSubmit = async (data) => {
      try {
        request({
          url: `/v1/file_data/${image.id}`,
          method: 'PUT',
          reqParams: {
            data
          }
        }).then((response) => {
          const { fileData } = response.data;
          dispatchImage(updateImage(fileData));
          handleChangeSelectImage(fileData);
          handleEditClose();
        });
      } catch (e) {
        console.error(e);
      }
    };

    useEffect(() => setValue('description', image.description), []);

    return (
      <DialogContent
        sx={{
          p: 3
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={`${image.mainUrl}`}
            alt={image.name}
            loading="lazy"
            width={250}
          />
        </Box>
        <Box sx={{ width: '40%', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {t('File name')} :
            </Typography>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {image.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {t('File type')} :
            </Typography>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {image.fileType}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {t('File capacity')} :
            </Typography>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {image.capacity}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {t('File size')} :
            </Typography>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {image.width}x{image.height}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {t('Uploaded at')} :
            </Typography>
            <Typography sx={{ fontSize: 18 * fontRate }}>
              {format(new Date(image.createdAt), 'yyyy/MM/dd HH:mm')}
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 18 * fontRate }}>
                {t('Description')} :
              </Typography>
              {editing ? (
                <Box sx={{ display: 'block' }}>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={handleEditClose}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    type="submit"
                    size="small"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={isSubmitting}
                  >
                    {t('Save')}
                  </Button>
                </Box>
              ) : (
                <IconButton
                  sx={{
                    '&:hover': {
                      background: theme.colors.primary.lighter
                    },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  onClick={handleEdit}
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            {editing ? (
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows="4"
                    InputProps={{
                      inputProps: {
                        style: {
                          fontSize: 18 * fontRate
                        }
                      }
                    }}
                  />
                )}
              />
            ) : (
              <Typography
                sx={{ fontSize: 18 * fontRate, overflowWrap: 'break-word' }}
              >
                {image.description}
              </Typography>
            )}
          </form>
        </Box>
      </DialogContent>
    );
  }
);

export default ImageDialog;
