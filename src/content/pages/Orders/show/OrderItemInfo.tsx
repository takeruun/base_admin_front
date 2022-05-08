import { FC } from 'react';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TableFooter,
  Typography
} from '@mui/material';
import type { OrderItem } from 'src/models/orderItem';
import { Goods, Course } from 'src/models/product';
interface OrderItemPropsType {
  productType: string;
  orderItems: OrderItem[];
}

const OrderItemInfo: FC<OrderItemPropsType> = ({
  productType,
  orderItems = []
}) => {
  const productTypeName = (): string => {
    if (productType == Course) return 'Course';
    else if (productType == Goods) return 'Goods';
    else return 'Other';
  };

  const { t }: { t: any } = useTranslation();
  const subPrice = (): number => {
    var price = 0;
    orderItems.forEach(
      (item) => (price += (item.price - item.discountAmount) * item.quantity)
    );
    return price;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '35%' }}>
              <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                {t(productType)}
              </Typography>
            </TableCell>
            {productType == Goods && (
              <TableCell>
                <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                  数量
                </Typography>
              </TableCell>
            )}
            <TableCell sx={{ width: '10%' }}>
              <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                {t('Price')}
              </Typography>
            </TableCell>
            <TableCell sx={{ width: '10%' }}>
              <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                {t('Discount rate')}
              </Typography>
            </TableCell>
            <TableCell sx={{ width: '10%' }}>
              <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                {t('Discount amount')}
              </Typography>
            </TableCell>
            <TableCell sx={{ width: '15%' }}>
              <Typography noWrap sx={{ fontWeight: 'bold' }} align="center">
                {t('Discount type')}
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ width: '10%' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderItems.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  <Typography noWrap align="center">
                    {item.product.name}
                  </Typography>
                </TableCell>
                {productType == Goods && (
                  <TableCell>
                    <Typography noWrap align="center">
                      {item.quantity}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography noWrap align="center">
                    ¥{numeral(item.price).format(`0,0`)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap align="center">
                    {item.discountRate}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap align="center">
                    ¥{numeral(item.discountAmount).format(`0,0`)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap align="center">
                    {item.discount.name}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {orderItems.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} align="right">
                <Typography
                  gutterBottom
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  {t(`${productTypeName()} sub total price`)}:
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ¥{numeral(subPrice()).format(`0,0`)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default OrderItemInfo;
