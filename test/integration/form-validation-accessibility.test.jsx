import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App.jsx';
import TextField from '../../src/components/TextField.jsx';
import CurrencySelect from '../../src/components/CurrencySelect.jsx';

describe('Form Validation Screen Reader Accessibility', () => {
  describe('TextField Component Accessibility', () => {
    it('sets aria-invalid="false" when there is no error', () => {
      render(
        <TextField id="email" label="Email" value="" onChange={() => {}} />,
      );

      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('sets aria-invalid="true" and connects aria-describedby to live region alert when error is present', () => {
      render(
        <TextField
          id="email"
          label="Email"
          value="invalid"
          onChange={() => {}}
          error="Please enter a valid email address."
        />,
      );

      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');

      const errorSpan = screen.getByText(/please enter a valid email address/i);
      expect(errorSpan).toHaveAttribute('id', 'email-error');
      expect(errorSpan).toHaveAttribute('aria-live', 'assertive');
      expect(errorSpan).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('CurrencySelect Component Accessibility', () => {
    it('sets aria-invalid="false" when no error is passed', () => {
      render(
        <CurrencySelect
          id="from-currency"
          label="From Currency"
          value="USD"
          onChange={() => {}}
        />,
      );

      const select = screen.getByLabelText(/from currency/i);
      expect(select).toHaveAttribute('aria-invalid', 'false');
      expect(select).not.toHaveAttribute('aria-describedby');
    });

    it('sets aria-invalid="true", aria-describedby, and renders live region alert when error is present', () => {
      render(
        <CurrencySelect
          id="to-currency"
          label="To Currency"
          value="USD"
          onChange={() => {}}
          error="Source and destination must differ."
        />,
      );

      const select = screen.getByLabelText(/to currency/i);
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(select).toHaveAttribute('aria-describedby', 'to-currency-error');

      const errorSpan = screen.getByText(/source and destination must differ/i);
      expect(errorSpan).toHaveAttribute('id', 'to-currency-error');
      expect(errorSpan).toHaveAttribute('role', 'alert');
      expect(errorSpan).toHaveAttribute('aria-live', 'assertive');
      expect(errorSpan).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Send Money Form Submission Accessibility', () => {
    beforeEach(() => {
      window.history.pushState({}, '', '/send');
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('announces form validation errors via assertive live region and focuses the first invalid field', async () => {
      const user = userEvent.setup();
      render(<App />);

      const submitBtn = screen.getByRole('button', { name: /review & send/i });
      await user.click(submitBtn);

      const recipientInput = screen.getByLabelText(/recipient/i);
      expect(recipientInput).toHaveFocus();
      expect(recipientInput).toHaveAttribute('aria-invalid', 'true');

      const summaryAlert = screen.getByText(
        /form submission failed with 2 validation errors/i,
      );
      expect(summaryAlert).toBeInTheDocument();
      expect(summaryAlert).toHaveAttribute('role', 'alert');
      expect(summaryAlert).toHaveAttribute('aria-live', 'assertive');
      expect(summaryAlert).toHaveAttribute('aria-atomic', 'true');
    });
  });
});
