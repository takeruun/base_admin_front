import { VFC, useState, createContext, ReactNode } from 'react';
import { textHtmlProps } from 'src/components/Order/ReceiptContent/types';

type newProps = textHtmlProps & {
  current: any;
};

type ReceiptTextsContextType = {
  receiptTexts: newProps[];
  handleReceiptTexts: (receiptTexts: newProps[]) => void;
};

export const ReceiptTextsContext = createContext<ReceiptTextsContextType>(
  {} as ReceiptTextsContextType
);

type Props = {
  children: ReactNode;
};

export const ReceiptTextsProvider: VFC<Props> = ({ children }) => {
  const [receiptTexts, setReceiptTexts] = useState<newProps[]>([]);
  const handleReceiptTexts = (receiptTexts: newProps[]) => {
    setReceiptTexts(receiptTexts);
  };
  return (
    <ReceiptTextsContext.Provider value={{ receiptTexts, handleReceiptTexts }}>
      {children}
    </ReceiptTextsContext.Provider>
  );
};
