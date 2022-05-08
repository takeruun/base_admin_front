import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, Collapse, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ExpandMore from 'src/components/molecule/ExpandMore';
import ImageRegister from './ImageRegister';
import ImagesList from './ImagesList';

const ImageSavesBody: FC = () => {
  const { t }: { t: any } = useTranslation();

  const [imageRegisterExpand, setImageRegisterExpand] = useState(true);
  const handleImageRegisterExpand = useCallback(
    () => setImageRegisterExpand((prev) => !prev),
    []
  );

  const [imagesExpand, setImagesExpand] = useState(true);
  const handleUserExpand = useCallback(
    () => setImagesExpand((prev) => !prev),
    []
  );

  return (
    <>
      <Card>
        <CardHeader
          title={t('Image saves')}
          action={
            <ExpandMore
              expand={imageRegisterExpand}
              onClick={handleImageRegisterExpand}
              aria-expanded={imageRegisterExpand}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
        />
        <Divider />
        <Collapse in={imageRegisterExpand} timeout="auto" unmountOnExit>
          <ImageRegister />
        </Collapse>
      </Card>
      <Card
        sx={{
          mt: 3
        }}
      >
        <CardHeader
          title={t('Image list')}
          action={
            <ExpandMore
              expand={imagesExpand}
              onClick={handleUserExpand}
              aria-expanded={imagesExpand}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
        />
        <Divider />
        <Collapse in={imagesExpand} timeout="auto" unmountOnExit>
          <ImagesList />
        </Collapse>
      </Card>
    </>
  );
};

export default ImageSavesBody;
