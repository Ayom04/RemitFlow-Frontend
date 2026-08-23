// Formatting helpers for currency, dates and addresses.
import { DEFAULT_LOCALE } from '../constants/locales.js';
import { parseDecimal, quantize } from './money.js';

/**
 * Format an amount as a currency string.
 *
 * Low-level helper: it assumes two decimal places and falls back to 0 for a
 * non-numeric amount. For money that arrived from an API use `formatMoney`
 * in utils/money.js instead, which honours the currency's real minor unit and
 * refuses to render an unparseable value as "0.00".
 *
 * @param {number|string} amount - the amount to format
 * @param {string} [currency] - ISO currency code, e.g. "USD"
 * @param {string} [locale] - BCP 47 locale tag used for grouping, decimal
 *   separator and symbol placement, e.g. "en-US" or "fr-FR"
 * @returns {string} the formatted currency string
 */
export function formatAmount(
  amount,
  currency = 'USD',
  locale = DEFAULT_LOCALE,
) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format a date for display.
 * @param {string|number|Date} value - the date to format
 * @param {string} [locale] - BCP 47 locale tag
 * @returns {string} the formatted date, or "-" when value is missing
 */
export function formatDate(value, locale = DEFAULT_LOCALE) {
  if (!value) return '-';
  const d = new Date(value);
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an exchange rate as a "1 FROM = X TO" string.
 * Accepts the decimal strings that the FX and quote services now produce as
 * well as plain numbers; anything unparseable renders as "-".
 * @param {number|string} rate
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
export function formatRate(rate, from, to) {
  const parsed = parseDecimal(rate);
  if (!parsed.ok) return '-';
  return `1 ${from} = ${Number(parsed.value).toFixed(4)} ${to}`;
}

/**
 * Normalise a raw amount string into a clean, fixed-precision value for the
 * amount field (e.g. "1,234.5" -> "1234.50").
 *
 * The value is parsed first and only stripped of grouping characters as a
 * fallback. Stripping first corrupts perfectly valid input: `<input
 * type="number">` accepts "1e3", and the old strip-then-parse implementation
 * turned that into "13.00" — a 1000x under-send with no error anywhere. A
 * leading minus is likewise preserved so a negative amount reaches validation
 * as negative instead of being silently flipped positive.
 *
 * @param {string|number} value - the raw input value
 * @param {string} [currency] - used for minor-unit precision
 * @returns {string} the cleaned amount, or '' if the input is not a number
 */
export function formatCurrencyInput(value, currency = 'USD') {
  if (value == null) return '';

  let parsed = parseDecimal(value);
  if (!parsed.ok) {
    // Fall back to stripping display formatting (grouping separators,
    // currency symbols, whitespace) while keeping sign and decimal point.
    const stripped = String(value).replace(/[^0-9.eE+-]/g, '');
    parsed = parseDecimal(stripped);
  }
  if (!parsed.ok) return '';

  return quantize(parsed.value, currency);
}

/**
 * Format a fractional ratio as a percentage string (0.005 -> "0.5%").
 * @param {number} value - the ratio to format
 * @param {number} [decimals] - decimal places to keep
 * @returns {string} the formatted percentage
 */
export function formatPercent(value, decimals = 2) {
  const num = Number(value) || 0;
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Format a plain number with grouped thousands and no currency symbol.
 * @param {number} value - the number to format
 * @param {number} [decimals] - maximum decimal places to show
 * @param {string} [locale] - BCP 47 locale tag
 * @returns {string} the formatted number
 */
export function formatNumber(value, decimals = 2, locale = DEFAULT_LOCALE) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Shorten a long string (e.g. a Stellar public key) for display.
 * @param {string} value - the value to shorten
 * @param {number} [head] - characters to keep at the start
 * @param {number} [tail] - characters to keep at the end
 * @returns {string} the shortened value, or the original if already short
 */
export function shortenAddress(value, head = 6, tail = 4) {
  if (!value || value.length <= head + tail) return value || '-';
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}
