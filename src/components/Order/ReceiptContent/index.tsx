import { useEffect, VFC } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button } from '@mui/material';
import ReceiptBody from './ReceiptBody';
import { useReceiptContent } from './store';

const ReceiptContent: VFC = () => {
  const { t }: { t: any } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    texts,

    handleReceiptTexts,
    handleSetTexts,
    handleCHangeWidth,
    handleChangePosition,
    getOrder
  } = useReceiptContent();

  useEffect(() => {
    getOrder(orderId);
  }, [getOrder]);

  return (
    <>
      <Box sx={{ my: 4 }}>
        <ReceiptBody
          texts={texts}
          handleSetTexts={handleSetTexts}
          handleCHangeWidth={handleCHangeWidth}
          handleChangePosition={handleChangePosition}
        />
      </Box>
      <Box sx={{ mt: 7 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleReceiptTexts(
              texts.map((text) => {
                return {
                  ...text,
                  current: text.htmlRef.current
                };
              })
            );
            navigate({
              pathname: '/receipt',
              search: '?preview=true'
            });
          }}
        >
          {t('Preview')}
        </Button>
      </Box>
    </>
  );
};

export default ReceiptContent;
