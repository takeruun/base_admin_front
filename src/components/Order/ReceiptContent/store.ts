import { useState, useContext, useCallback, createRef } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import request from 'src/hooks/useRequest';
import { ReceiptTextsContext } from 'src/contexts/ReceiptTextsContext';
import type { Order } from 'src/models/order';
import { textHtmlProps } from './types';

export const useReceiptContent = () => {
  const { handleReceiptTexts } = useContext(ReceiptTextsContext);
  const [firstMount, setFirstMount] = useState(true);
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

  const getOrder = useCallback(
    async (orderId) => {
      try {
        if (firstMount && texts.length > 0) {
          const response = await request({
            url: `/v1/orders/${orderId}`,
            method: 'GET'
          });
          const order: Order = response.data.order;
          const customer = order.customer;

          setTexts(
            texts.map((text) => {
              if (text.htmlRef.current !== null) {
                switch (text.id) {
                  case 1:
                    text.htmlRef.current.innerHTML = `<p>${customer.familyName} ${customer.givenName}</p>`;
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
    },
    [texts, firstMount, setFirstMount]
  );

  const store = {
    texts,

    handleReceiptTexts,
    handleSetTexts,
    handleCHangeWidth,
    handleChangePosition,
    getOrder
  };

  return store;
};
