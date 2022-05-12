import { VFC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { Card, CardHeader, Collapse, Divider } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Order } from 'src/models/order';
import UserForm from './UserForm';
import OrderForm from './OrderForm';
import { useFormState } from './store';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

const Form: VFC<{ order?: Order }> = ({ order }) => {
  const { t }: { t: any } = useTranslation();

  const {
    methods,
    orderExpand,
    userExpand,
    onSubmit,
    removeOrderItem,
    handleOrderExpand,
    handleUserExpand,
    setOrder
  } = useFormState(order?.id);

  const { handleSubmit } = methods;

  useEffect(() => {
    setOrder(order);
  }, [order]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader
              title={t('Customer info')}
              action={
                <ExpandMore
                  expand={userExpand}
                  onClick={handleUserExpand}
                  aria-expanded={userExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
            />
            <Divider />
            <Collapse in={userExpand} timeout="auto" unmountOnExit>
              <UserForm />
            </Collapse>
          </Card>
          <Card
            sx={{
              mt: 3
            }}
          >
            <CardHeader
              title={t('Order info')}
              action={
                <ExpandMore
                  expand={orderExpand}
                  onClick={handleOrderExpand}
                  aria-expanded={orderExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
            />
            <Divider />
            <Collapse in={orderExpand} timeout="auto" unmountOnExit>
              <OrderForm removeOrderItem={removeOrderItem} order={order} />
            </Collapse>
          </Card>
        </form>
      </FormProvider>
    </>
  );
};

export default Form;
