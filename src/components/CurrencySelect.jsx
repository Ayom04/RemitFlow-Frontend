import { CURRENCIES } from '../constants/currencies.js';
import './CurrencySelect.css';

/**
 * Dropdown for picking a currency.
 * @param {object} props
 * @param {string} props.value - selected currency code
 * @param {Function} props.onChange - called with the new code
 * @param {string} [props.label] - field label
 * @param {string} [props.id] - input id, also used for the label association
 * @param {string} [props.error] - validation error message to display
 */
export default function CurrencySelect({ value, onChange, label, id, error }) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div className="currency-select">
      {label && (
        <label htmlFor={id} className="currency-select-label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`currency-select-input ${error ? 'has-error' : ''}`}
        value={value}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code} — {c.name}
          </option>
        ))}
      </select>
      {error && (
        <span
          id={errorId}
          className="currency-select-error"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </span>
      )}
    </div>
  );
}
