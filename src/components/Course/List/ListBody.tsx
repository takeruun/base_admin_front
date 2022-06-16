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
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import type { ListBodyPropsType } from './types';

const ListBody: VFC<ListBodyPropsType> = memo(
  ({ courses, handleConfirmDelete, handleSetDeleteId }) => {
    const { t }: { t: any } = useTranslation();

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Course id')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Category name')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Course name')}
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
            {courses.map((product) => {
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
                    <Typography noWrap>
                      ¥{numeral(product.price).format('0,0')}
                    </Typography>
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
