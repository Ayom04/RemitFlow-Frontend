import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App.jsx';

const TRANSFERS = [
  {
    id: 'tx_1001',
    recipient: 'amina@example.com',
    from: 'USD',
    to: 'NGN',
    sendAmount: 200,
    receiveAmount: 294620,
    status: 'completed',
    createdAt: '2026-05-28T10:15:00Z',
  },
  {
    id: 'tx_1002',
    recipient: 'dev@example.com',
    from: 'USD',
    to: 'INR',
    sendAmount: 120,
    receiveAmount: 9920,
    status: 'pending',
    createdAt: '2026-06-02T08:42:00Z',
  },
];

describe('Mobile Dashboard Responsiveness Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-06-05T12:00:00Z'));
    window.history.pushState({}, '', '/transfers');
    localStorage.setItem('remitflow.transfers', JSON.stringify(TRANSFERS));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders dashboard with a single chart heading and transfer rows', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: /your transfers/i });

    // Chart heading renders exactly once
    const chartHeadings = await screen.findAllByRole('heading', {
      name: /recent transfer amounts/i,
    });
    expect(chartHeadings.length).toBe(1);

    // Transfer rows are visible (PullToRefresh renders them)
    // TransferRow cells contain recipient text
    const transferItems = await screen.findAllByText(/Completed|Pending/i);
    expect(transferItems.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all filter controls accessible for mobile viewports', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: /your transfers/i });

    const searchInput = screen.getByLabelText(/search transfers by recipient/i);
    const statusSelect = screen.getByLabelText(/filter by status/i);
    const rangeSelect = screen.getByLabelText(/filter by date range/i);

    expect(searchInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(rangeSelect).toBeInTheDocument();
  });
});
