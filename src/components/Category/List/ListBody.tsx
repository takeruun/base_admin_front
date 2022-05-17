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
import { useTranslation } from 'react-i18next';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import type { ListBodyPropsType } from './types';

const ListBody: VFC<ListBodyPropsType> = memo(
  ({ categories, handleConfirmDelete, handleSetDeleteId }) => {
    const { t }: { t: any } = useTranslation();

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                  {t('Category id')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {t('Category name')}
                </Typography>
              </TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => {
              return (
                <TableRow hover key={category.id}>
                  <TableCell align="center">
                    <Typography>{category.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{category.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap>
                      <Tooltip title={t('Delete')} arrow>
                        <IconButton
                          onClick={() => {
                            handleConfirmDelete();
                            handleSetDeleteId(category.id);
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
