import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../../lib/api';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, formatNaira } from '../../lib/format';
import { PageLoader } from '../../components/ui/Spinner';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api(`/admin/customers?search=${encodeURIComponent(debounced)}&page=${page}&limit=20`)
      .then((response) => {
        if (active) setData(response);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [debounced, page]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">People</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Customers</h1>
        <p className="mt-1 text-xs text-smoke">
          {data.total} registered customer{data.total === 1 ? '' : 's'}
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or phone"
            className="input pl-10"
          />
        </div>
      </div>

      {loading ? (
        <PageLoader label="Loading customers…" />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">No customers found</p>
          <p className="mt-1 text-xs text-smoke">
            Customers appear here when they create an account.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-cloud text-[10px] uppercase tracking-[0.12em] text-smoke">
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Orders</th>
                  <th className="px-4 py-3 font-semibold">Total spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((customer) => (
                  <tr key={customer._id} className="transition hover:bg-cloud">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/customers/${customer._id}`}
                        className="font-semibold text-ink hover:text-accent hover:underline"
                      >
                        {customer.name}
                      </Link>
                      <p className="text-[10px] text-smoke">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3 text-smoke">{customer.phone || '—'}</td>
                    <td className="px-4 py-3 text-smoke">{formatDate(customer.createdAt)}</td>
                    <td className="px-4 py-3 text-ink">{customer.ordersCount || 0}</td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {formatNaira(customer.totalSpent || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs">
              <span className="text-smoke">
                Page {data.page} of {data.pages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="btn-outline px-3 py-1.5 text-[11px]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => setPage((value) => value + 1)}
                  className="btn-outline px-3 py-1.5 text-[11px]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
