import { useCallback, useEffect, useState } from 'react';
import { listTransfers, createTransfer } from '../services/api.js';
import { ContractViolationError } from '../services/contracts/schema.js';

/**
 * Hook for loading and creating transfers.
 * @returns {{transfers: Array, loading: boolean, error: string|null,
 *   reload: Function, addTransfer: Function}}
 */
export function useTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTransfers();
      setTransfers(data);
    } catch (err) {
      if (err instanceof ContractViolationError) {
        // A schema change, not a flaky request. Retrying will not help, and
        // showing an empty list would imply the transfers no longer exist.
        console.error(err.message);
        setError(
          `Your transfers could not be displayed: the data did not match the expected format (${err.contract}). Nothing has been lost — please try again shortly.`,
        );
      } else {
        setError('Could not load transfers. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTransfer = useCallback(async (payload) => {
    const created = await createTransfer(payload);
    setTransfers((prev) => [created, ...prev]);
    return created;
  }, []);

  return { transfers, loading, error, reload, addTransfer };
}
