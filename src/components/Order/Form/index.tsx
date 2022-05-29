import { VFC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { Card, CardHeader, Collapse, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandMore from 'src/components/molecule/ExpandMore';
import { Order } from 'src/models/order';
import CustomerForm from './CustomerForm';
import OrderForm from './OrderForm';
import { useOrderIndexForm } from './store';

const Form: VFC<{ order?: Order }> = ({ order }) => {
  const { t }: { t: any } = useTranslation();

  const {
    methods,
    orderExpand,
    userExpand,
    onSubmit,
    handleOrderExpand,
    handleUserExpand,
    setOrder,
    execReset
  } = useOrderIndexForm(order?.id);

  const { handleSubmit } = methods;

  useEffect(() => {
    setOrder(order);

    return () => execReset();
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
              <CustomerForm />
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
              <OrderForm order={order} />
            </Collapse>
          </Card>
        </form>
      </FormProvider>
    </>
  );
};

export default Form;
