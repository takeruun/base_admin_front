import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Button, Box, useTheme } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import numeral from 'numeral';
import request from 'src/hooks/useRequest';

const PageHeader = () => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const initalChartOption: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.warning.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.warning.main],
      width: 2
    },
    legend: {
      show: false
    },
    labels: [],
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };
  const [chartOption, setChartOption] =
    useState<ApexOptions>(initalChartOption);
  const [chartDate, setChartDate] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [monthlySales, setMonthlySales] = useState<number>(0);

  const getSalesData = useCallback(() => {
    try {
      request({
        url: '/v1/orders/sales_data',
        method: 'GET',
        reqParams: {
          params: {
            productType: 'all',
            section: 'month'
          }
        }
      }).then((response) => {
        if (response.data.salesData) {
          var days = [];
          var prices = [];
          response.data.salesData.forEach((data) => {
            const daySplit = data.day.split('-');
            const day = `${daySplit[0]}/${daySplit[1]}`;
            if (!days.includes(day)) {
              days.push(day);
              prices.push(data.totalPrice);
            } else {
              prices[days.indexOf(day)] += data.totalPrice;
            }
          });
          setChartDate([{ name: '月の売上', data: prices }]);
          setChartOption({ ...initalChartOption, labels: days });
          setMonthlySales(response.data.salesResult.totalPrice);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getSalesData();
  }, [getSalesData]);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="h3" gutterBottom sx={{ m: 0, mr: 2 }}>
              今月の売上 : ¥{numeral(monthlySales).format(`0,0`)}
            </Typography>
            {chartDate && (
              <Box sx={{ ml: 2 }}>
                <Chart
                  options={chartOption}
                  series={chartDate}
                  type="area"
                  height={70}
                />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item>
          <Link to="/dashboards/orders/new" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create Order')}
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default PageHeader;
