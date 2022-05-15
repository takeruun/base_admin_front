import { VFC, ReactNode } from 'react';
import { SidebarProvider } from './SidebarContext';
import { AuthProvider } from './JWTAuthContext';
import { ReceiptTextsProvider } from './ReceiptTextsContext';
import { ImageProvider } from './ImageContext';
import { DashboardProvider } from './DashboardContext';
import { CalendarProvider } from './CalendarContext';

type Props = {
  children: ReactNode;
};

export const RootContextProvider: VFC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AuthProvider>
        <ReceiptTextsProvider>
          <ImageProvider>
            <DashboardProvider>
              <CalendarProvider>{children}</CalendarProvider>
            </DashboardProvider>
          </ImageProvider>
        </ReceiptTextsProvider>
      </AuthProvider>
    </SidebarProvider>
  );
};
