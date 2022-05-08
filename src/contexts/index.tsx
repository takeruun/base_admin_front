import { FC, ReactNode } from 'react';
import { SidebarProvider } from './SidebarContext';
import { AuthProvider } from './JWTAuthContext';
import { ReceiptTextsProvider } from './ReceiptTextsContext';
import { ImageProvider } from './ImageContext';
import { OrderCalendarProvider } from './OrderCalendarContext';
import { OrderProvider } from './OrderContext';

type Props = {
  children: ReactNode;
};

export const RootContextProvider: FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AuthProvider>
        <ReceiptTextsProvider>
          <ImageProvider>
            <OrderCalendarProvider>
              <OrderProvider>{children}</OrderProvider>
            </OrderCalendarProvider>
          </ImageProvider>
        </ReceiptTextsProvider>
      </AuthProvider>
    </SidebarProvider>
  );
};
