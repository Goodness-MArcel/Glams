import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { supabase } from '../../../supabase/config.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Cache configuration
const WEEKLY_SALES_CACHE_CONFIG = {
  chartData: 'weekly_sales_chart_cache',
  ttl: 20 * 60 * 1000 // 20 minutes
};

// Cache utility functions
const weeklySalesChartCacheUtils = {
  setCache: (key, data, ttl = WEEKLY_SALES_CACHE_CONFIG.ttl) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  },

  getCache: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp, ttl } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > ttl;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  clearCache: (key) => {
    localStorage.removeItem(key);
  }
};

function WeeklySalesChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Daily Revenue',
      data: [],
      borderColor: 'rgb(13, 110, 253)',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(13, 110, 253)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklySalesData();
  }, []);

  const fetchWeeklySalesData = async () => {
    try {
      setLoading(true);

      // Check cache first
      const cachedChartData = weeklySalesChartCacheUtils.getCache(WEEKLY_SALES_CACHE_CONFIG.chartData);
      if (cachedChartData) {
        console.log('Using cached weekly sales chart data');
        setChartData(cachedChartData);
        setLoading(false);
        return;
      }

      // Get data for the last 7 days
      const dailyData = [];
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Format label (e.g., "Mon", "Tue", etc.)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(dayName);

        // Fetch orders for this day
        const { data: dayOrders, error } = await supabase
          .from('orders')
          .select('totals')
          .gte('order_date', startOfDay.toISOString())
          .lte('order_date', endOfDay.toISOString());

        if (error) {
          console.error('Error fetching day orders:', error);
          dailyData.push(0);
          continue;
        }

        // Calculate total revenue for the day
        const dayRevenue = dayOrders?.reduce((sum, order) => sum + (order.totals?.total || 0), 0) || 0;
        dailyData.push(dayRevenue);
      }

      const newChartData = {
        labels,
        datasets: [{
          label: 'Daily Revenue (₦)',
          data: dailyData,
          borderColor: 'rgb(13, 110, 253)',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(13, 110, 253)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      };

      // Cache the chart data
      weeklySalesChartCacheUtils.setCache(WEEKLY_SALES_CACHE_CONFIG.chartData, newChartData);
      
      setChartData(newChartData);
    } catch (error) {
      console.error('Error fetching weekly sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: 'Weekly Sales Performance',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(13, 110, 253, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Revenue: ₦${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return '₦' + value.toLocaleString();
          },
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading chart...</span>
          </div>
          <small className="text-muted">Loading sales data...</small>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '250px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default WeeklySalesChart;