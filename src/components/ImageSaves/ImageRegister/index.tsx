import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { buildStyles } from 'react-circular-progressbar';
import {
  Avatar,
  Alert,
  Box,
  Button,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
  styled
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import Gauge from 'src/components/Gauge';
import { useAllCapacity, usePostFiles } from 'src/hooks/useFileData';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: #C1C1C1;
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const ImageRegister = () => {
  const { t }: { t: any } = useTranslation();
  const { usingRate, capacityMessage, gaugeColor, getAllCapacity } =
    useAllCapacity();
  const { successFiles, postFiles } = usePostFiles();

  const onDrop = useCallback((acceptedFiles) => {
    postFiles(acceptedFiles);
  }, []);

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop
  });

  useEffect(() => getAllCapacity(), []);

  return (
    <CardContent>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Box
            sx={{
              backgroundColor: '#EFEFEF',
              border: '1px dashed',
              borderColor: '#A9A9A9',
              width: '100%',
              pb: 2
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ textAlign: 'center', mt: 1 }}>
                ファイルをドロップしてアップロード
              </Typography>
              <Typography sx={{ textAlign: 'center' }}>または</Typography>
              <Typography sx={{ textAlign: 'center' }}>
                クリックしてファイル選択
              </Typography>
            </Box>
            <Box
              sx={{
                mx: 'auto',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isDragAccept && (
                <>
                  <AvatarSuccess variant="rounded">
                    <CheckTwoToneIcon />
                  </AvatarSuccess>
                  <Typography
                    sx={{
                      mt: 2
                    }}
                  >
                    {t('Drop the files to start uploading')}
                  </Typography>
                </>
              )}
              {!isDragActive && (
                <AvatarWrapper variant="rounded">
                  <CloudUploadIcon sx={{ color: '#FFFFFF' }} />
                </AvatarWrapper>
              )}
              {isDragReject && (
                <>
                  <AvatarDanger variant="rounded">
                    <CloseTwoToneIcon />
                  </AvatarDanger>
                  <Typography
                    sx={{
                      mt: 2
                    }}
                  >
                    {t('You cannot upload these file types')}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          {successFiles.length > 0 && (
            <Box
              sx={{
                mx: 'auto'
              }}
            >
              <Alert
                sx={{
                  py: 0,
                  mt: 2
                }}
                severity="success"
              >
                {t('You have uploaded')} <b>{successFiles.length}</b>{' '}
                {t('files')}!
              </Alert>
              <Divider
                sx={{
                  mt: 2
                }}
              />
              <List disablePadding component="div">
                {successFiles.map((file, index) => {
                  return (
                    <ListItem component="div" key={index}>
                      <ListItemText primary={file.name} />
                      <b>{file.size} bytes</b>
                      <Divider />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </Grid>
        <Grid item xs={5}>
          <Gauge
            circleRatio={0.65}
            styles={buildStyles({ rotation: 1 / 2 + 1 / 5.7 })}
            value={usingRate}
            strokeWidth={10}
            text={`${usingRate}%`}
            color={gaugeColor}
          ></Gauge>
          <Typography sx={{ textAlign: 'center' }}>
            {capacityMessage}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" size="small">
              {t('Increase storage')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ImageRegister;
