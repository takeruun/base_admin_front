import {
  FC,
  useContext,
  useState,
  useEffect,
  MutableRefObject,
  useCallback,
  createRef
} from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import numeral from 'numeral';
import { Box, Container, Button } from '@mui/material';
import { ReceiptTextsContext } from 'src/contexts/ReceiptTextsContext';
import type { Order } from 'src/models/order';
import request from 'src/hooks/useRequest';
import ReceiptBody from './ReceiptBody';

export type textHtmlProps = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  htmlRef: MutableRefObject<any>;
  initialHtml?: string;
};

const Receipt: FC = () => {
  const { t }: { t: any } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { handleReceiptTexts } = useContext(ReceiptTextsContext);

  const [firstMount, setFirstMount] = useState<boolean>(true);
  const [texts, setTexts] = useState<textHtmlProps[]>([]);
  const handleSetTexts = (text: textHtmlProps) =>
    setTexts((prev) => [...prev, text]);

  const handleCHangeWidth = (id: number, width: number, height: number) =>
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, width, height } : text))
    );

  const handleChangePosition = (id: number, x: number, y: number) =>
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, x, y } : text))
    );

  const initialTexts: textHtmlProps[] = [
    {
      id: 1,
      width: 120,
      height: 30,
      x: 352,
      y: 65,
      htmlRef: createRef()
    },
    {
      id: 2,
      width: 130,
      height: 30,
      x: 375,
      y: 110,
      htmlRef: createRef()
    },
    {
      id: 3,
      width: 160,
      height: 30,
      x: 595,
      y: 67,
      htmlRef: createRef()
    },
    {
      id: 4,
      width: 60,
      height: 30,
      x: 282,
      y: 259,
      htmlRef: createRef()
    }
  ];

  const getOrder = useCallback(async () => {
    try {
      if (firstMount && texts.length > 0) {
        const response = await request({
          url: `/v1/orders/${orderId}`,
          method: 'GET'
        });
        const order: Order = response.data.order;
        const user = order.user;

        setTexts(
          texts.map((text) => {
            if (text.htmlRef.current !== null) {
              switch (text.id) {
                case 1:
                  text.htmlRef.current.innerHTML = `<p>${user.familyName} ${user.givenName}</p>`;
                  text.htmlRef.current.style.fontSize = '18px';
                  break;
                case 2:
                  text.htmlRef.current.innerHTML = `<p>¥ ${numeral(
                    order.totalPrice
                  ).format('0,0')}</p>`;
                  text.htmlRef.current.style.fontSize = '18px';
                  break;
                case 3:
                  text.htmlRef.current.innerHTML = `<p>${format(
                    new Date(),
                    'yyyy      M       d'
                  ).replace(/\s(?=[\w\s\d])/g, '&nbsp;')}</p>`;
                  text.htmlRef.current.style.fontSize = '18px';
                  break;
                case 4:
                  text.htmlRef.current.innerHTML = `<p>${order.taxRate}%</p>`;
                  break;
                default:
                  break;
              }
              text.initialHtml = text.htmlRef.current.innerHTML;

              return text;
            }
          })
        );

        setFirstMount(false);
      }

      if (texts.length == 0) {
        setTexts(initialTexts);
      }
    } catch (e) {
      console.error(e);
    }
  }, [texts, firstMount, setFirstMount]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  return (
    <>
      <Helmet>
        <title>{t('Receipt')}</title>
      </Helmet>
      <Container>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
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
        </Box>
      </Container>
    </>
  );
};

export default Receipt;
