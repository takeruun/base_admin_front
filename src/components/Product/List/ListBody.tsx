import { VFC, memo } from 'react';
import {
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useTranslation } from 'react-i18next';
import { ListBodyPropsType } from './types';

const ListBody: VFC<ListBodyPropsType> = memo(
  ({ products, handleConfirmDelete, handleSetDeleteId }) => {
    const { t }: { t: any } = useTranslation();

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Product id')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Category name')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Product name')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Price')}
                </Typography>
              </TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              return (
                <TableRow hover key={product.id}>
                  <TableCell align="center">
                    <Typography>{product.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{product.category.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{product.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{product.price}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap>
                      <Tooltip title={t('Delete')} arrow>
                        <IconButton
                          onClick={() => {
                            handleConfirmDelete();
                            handleSetDeleteId(product.id);
                          }}
                          color="primary"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

export default ListBody;
