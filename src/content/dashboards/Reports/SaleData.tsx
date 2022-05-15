import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import Chart from 'react-apexcharts';
import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Divider,
  Menu,
  MenuItem,
  CardActions,
  Grid,
  Typography,
  styled,
  Tabs,
  Tab
} from '@mui/material';
import numeral from 'numeral';
import Label from 'src/components/Label';
import { useSaleDataState } from './store';

const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: 0;
      display: block;
`
);

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: auto;
      height: ${theme.spacing(17)};
      margin-top: ${theme.spacing(2)};
`
);

const SaleData = () => {
  const { t }: { t: any } = useTranslation();
  const {
    actionRef1,
    openMenu,
    section,
    currentTab,
    options,
    chartData,
    data,

    setSection,
    handleOpenMenu,
    handleCloseMenu,
    handleTabsChange,
    getSaleData
  } = useSaleDataState();
  const sections = [
    {
      value: 'day',
      text: t('Day')
    },
    {
      value: 'month',
      text: t('Month')
    }
  ];

  const tabs = [
    { value: 'all', label: t('All') },
    { value: 'course', label: t('Course') },
    { value: 'goods', label: t('Shop item') }
  ];

  useEffect(() => {
    getSaleData();
  }, [getSaleData]);

  return (
    <Card>
      <CardHeader
        action={
          <>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={handleOpenMenu}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {section}
            </Button>
            <Menu
              disableScrollLock
              anchorEl={actionRef1.current}
              onClose={handleCloseMenu}
              open={openMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {sections.map((_period) => (
                <MenuItem
                  key={_period.value}
                  onClick={() => {
                    setSection(_period.value);
                    handleOpenMenu();
                  }}
                >
                  {_period.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        }
        title={t('Sales chart')}
      />
      <Divider />
      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>
      <Divider
        sx={{
          display: { xs: 'none', sm: 'flex' }
        }}
      />
      <CardContent>
        {chartData != null ? (
          <Chart options={options} series={chartData} type="bar" height={316} />
        ) : (
          <Box
            sx={{
              textAlign: 'center'
            }}
          >
            <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />
            <Typography
              align="center"
              variant="h4"
              fontWeight="normal"
              color="text.secondary"
              sx={{
                mt: 3
              }}
              gutterBottom
            >
              <b> 集計期間 </b> に対応する売上チャートはありません。
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActionsWrapper>
        <Box>
          <Grid container alignItems="center">
            <Grid xs={12} item>
              <Box
                sx={{
                  p: 3
                }}
              >
                <Box>
                  {data && (
                    <>
                      <Typography
                        align="center"
                        variant="body1"
                        color="text.secondary"
                      >
                        {section === 'day' && t('Sales data for today')}
                        {section === 'week' && t('Sales data for this week')}
                        {section === 'month' && t('Sales data for this month')}
                      </Typography>
                      <Typography align="center" variant="h3" gutterBottom>
                        ¥{numeral(data?.totalPrice).format('0,0')}
                      </Typography>
                      <Typography align="center" variant="body1">
                        {data?.up ? (
                          <Label color="success">{data?.rate}%</Label>
                        ) : (
                          <Label color="error">{data?.rate}%</Label>
                        )}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Divider />
            </Grid>
          </Grid>
        </Box>
      </CardActionsWrapper>
    </Card>
  );
};

export default SaleData;
