// src/components/charts/DoughnutChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ data, options, className = '' }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
    ...options,
  };

  return (
    <div className={className}>
      <Doughnut data={data} options={defaultOptions} />
    </div>
  );
};