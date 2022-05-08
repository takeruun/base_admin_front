import { useRef, useState, ChangeEvent, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
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
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import Label from 'src/components/Label';
import request from 'src/hooks/useRequest';
import { productTypes } from 'src/models/product';
import numeral from 'numeral';
import { format, setDay, subDays } from 'date-fns';
import { addMonths, subMonths } from 'date-fns/esm';

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

function SaleData() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
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

  const chartOptions: ApexOptions = {
    theme: {
      mode: theme.palette.mode
    },
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },

    colors: [theme.colors.primary.main, theme.colors.error.main],
    fill: {
      opacity: 1
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    legend: {
      show: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        },
        formatter: function (val) {
          return '¥' + numeral(val).format('0,0');
        }
      }
    }
  };

  const actionRef1 = useRef<any>(null);
  const [openSection, setOpenMenuSection] = useState<boolean>(false);
  const [section, setSection] = useState<string>(t('Aggregation section'));

  const [currentTab, setCurrentTab] = useState<string>('course');
  const [options, setOptions] = useState<ApexOptions>(chartOptions);
  const [chartData, setChartData] = useState<
    { name: string; type: string; data: number[] }[] | null
  >([]);
  const [data, setData] = useState<{
    totalPrice: number;
    rate: number;
    up: boolean;
  } | null>(null);

  const tabs = [
    { value: 'all', label: t('All') },
    { value: 'course', label: t('Course') },
    { value: 'goods', label: t('Shop item') }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const getSaleData = useCallback(async () => {
    try {
      const now = new Date();
      const period = section == 'day' ? 14 : 6;

      var params = {};
      if (currentTab == 'all') {
        params = {
          product_types: [1, 2]
        };
      } else {
        params = {
          product_type: currentTab == 'course' ? 1 : 2
        };
      }
      request({
        url: '/v1/orders/sales_data',
        method: 'GET',
        reqParams: {
          params: {
            ...params,
            section,
            date_of_exit_from: format(
              section == 'day'
                ? subDays(now, period)
                : setDay(subMonths(now, period), 1),
              'yyyy-MM-dd'
            ),
            date_of_exit_to: format(
              section == 'day' ? now : subDays(setDay(addMonths(now, 1), 1), 1),
              'yyyy-MM-dd'
            )
          }
        }
      }).then((response) => {
        if (response.data.salesData) {
          const priceIndex = currentTab == 'course' ? 1 : 2;
          var days = [];
          var prices = [];
          if (currentTab == 'all') {
            prices[1] = [];
            prices[2] = [];
          } else {
            prices[priceIndex] = [];
          }

          for (let i = period; i > 0; i--) {
            const salesData = response.data.salesData.filter((sd) => {
              if (
                sd.day ==
                format(
                  section == 'day' ? subDays(now, i) : subMonths(now, i),
                  section == 'day' ? 'yyyy-M-d' : 'yyyy-M'
                )
              )
                return sd;
            });

            days.push(
              format(
                section == 'day' ? subDays(now, i) : subMonths(now, i),
                section == 'day' ? 'M/d' : 'yyyy/M'
              )
            );
            if (salesData.length > 0) {
              if (salesData.find((s) => s.productType == 1))
                prices[1].push(
                  salesData.find((s) => s.productType == 1).totalPrice
                );
              if (salesData.find((s) => s.productType == 2))
                prices[2].push(
                  salesData.find((s) => s.productType == 2).totalPrice
                );
              if (
                salesData.find((s) => s.productType == 2) == undefined &&
                currentTab == 'all'
              )
                prices[2].push(0);

              if (
                salesData.find((s) => s.productType == 1) == undefined &&
                currentTab == 'all'
              )
                prices[1].push(0);
            } else {
              if (currentTab == 'all') {
                prices[1].push(0);
                prices[2].push(0);
              } else {
                prices[priceIndex].push(0);
              }
            }
          }

          setData({
            totalPrice: response.data.salesResult.totalPrice,
            rate: response.data.salesResult.rate,
            up: response.data.salesResult.up
          });

          const chartData = [];
          if (currentTab == 'all') {
            prices.forEach((price, i) => {
              chartData.push({
                name: productTypes.find((p) => p.value == i)['label'],
                type: 'column',
                data: price
              });
            });
            setOptions({ ...options, labels: days, legend: { show: true } });
          } else {
            chartData.push({
              name: response.data.salesData[0].productType,
              type: 'column',
              data: prices[response.data.salesData[0].productType]
            });
            setOptions({ ...options, labels: days });
          }
          setChartData(chartData);
        } else setChartData(null);
      });
    } catch (e) {
      console.error(e);
    }
  }, [currentTab, section]);

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
              onClick={() => setOpenMenuSection(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {section}
            </Button>
            <Menu
              disableScrollLock
              anchorEl={actionRef1.current}
              onClose={() => setOpenMenuSection(false)}
              open={openSection}
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
                    setOpenMenuSection(false);
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
}

export default SaleData;
