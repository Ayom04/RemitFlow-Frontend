import Chart from './Chart.jsx';
import { formatAmount } from '../utils/format.js';

export default {
  title: 'Components/Chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    series: { control: 'object' },
    title: { control: 'text' },
    formatValue: { control: false },
    emptyStateIcon: { control: 'text' },
    emptyStateTitle: { control: 'text' },
    emptyStateMessage: { control: 'text' },
  },
};

const sampleData = [
  { value: 200, label: 'amina@example.com', currency: 'USD' },
  { value: 120, label: 'GBQAZ7Z3X7...', currency: 'USD' },
  { value: 450, label: 'chidi@example.com', currency: 'USD' },
  { value: 80, label: 'devi@example.com', currency: 'USD' },
  { value: 310, label: 'emeka@example.com', currency: 'USD' },
];

export const Default = {
  args: {
    title: 'Recent Transfer Amounts',
    data: sampleData,
    formatValue: (d) => formatAmount(d.value, d.currency),
  },
};

export const SingleTransfer = {
  args: {
    title: 'Single Transfer',
    data: [{ value: 250, label: 'juan@example.com', currency: 'USD' }],
    formatValue: (d) => formatAmount(d.value, d.currency),
  },
};

export const Empty = {
  args: {
    title: 'Monthly Transfers',
    data: [],
    emptyStateIcon: '💸',
    emptyStateTitle: 'No transfers yet',
    emptyStateMessage: 'Your first transfer will appear here.',
  },
};

export const MultiSeries = {
  args: {
    title: 'Sent vs Received Amounts',
    series: [
      {
        name: 'Sent',
        color: '#6366f1',
        data: sampleData,
      },
      {
        name: 'Received',
        color: '#10b981',
        data: sampleData.map((d) => ({ ...d, value: d.value * 0.9 })),
      },
    ],
    formatValue: (d) => `$${d.value.toFixed(2)}`,
  },
};
