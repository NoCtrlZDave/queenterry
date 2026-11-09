import { useState } from 'react';
import { Loader2, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { NIGERIAN_STATES } from '../../lib/nigeria';
import Modal from '../../components/ui/Modal';

const blank = { label: 'Home', street: '', city: '', state: '', phone: '', isDefault: false };

export default function Addresses() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const addresses = user?.addresses || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState('');

  const startAdd = () => {
    setEditing(null);
    setForm({ ...blank, phone: user?.phone || '' });
    setError('');
    setOpen(true);
  };

  const startEdit = (address) => {
    setEditing(address);
    setForm({
      label: address.label || 'Home',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      phone: address.phone || '',
      isDefault: Boolean(address.isDefault),
    });
    setError('');
    setOpen(true);
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.street.trim() || !form.city.trim() || !form.state) {
      setError('Street, city and state are required.');
      return;
    }
    setSaving(true);
    try {
      const data = editing
        ? await api(`/auth/addresses/${editing._id}`, { method: 'PUT', body: form })
        : await api('/auth/addresses', { method: 'POST', body: form });
      setUser((prev) => ({ ...prev, addresses: data.addresses }));
      toast(editing ? 'Address updated' : 'Address added');
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (address) => {
    if (!window.confirm(`Delete the “${address.label}” address?`)) return;
    setDeleting(address._id);
    try {
      const data = await api(`/auth/addresses/${address._id}`, { method: 'DELETE' });
      setUser((prev) => ({ ...prev, addresses: data.addresses }));
      toast('Address deleted');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDeleting('');
    }
  };

  const makeDefault = async (address) => {
    try {
      const data = await api(`/auth/addresses/${address._id}`, {
        method: 'PUT',
        body: { isDefault: true },
      });
      setUser((prev) => ({ ...prev, addresses: data.addresses }));
      toast('Default address updated');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Delivery addresses</h2>
          <p className="mt-1 text-xs text-smoke">
            Saved addresses autofill your checkout details.
          </p>
        </div>
        <button type="button" onClick={startAdd} className="btn-primary text-xs">
          <Plus className="h-4 w-4" />
          Add address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-cloud p-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-smoke/50" />
          <p className="mt-3 text-sm font-semibold text-ink">No saved addresses</p>
          <p className="mt-1 text-xs text-smoke">Add one to speed up your next order.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address._id} className="flex flex-col rounded-2xl border border-line p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-mist text-ink">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{address.label}</p>
                    {address.isDefault && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[9px] font-semibold text-accent">
                        <Star className="h-2.5 w-2.5" /> Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(address)}
                    className="rounded-full p-2 text-smoke transition hover:bg-mist hover:text-ink"
                    aria-label="Edit address"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(address)}
                    disabled={deleting === address._id}
                    className="rounded-full p-2 text-smoke transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    aria-label="Delete address"
                  >
                    {deleting === address._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-4 flex-1 text-xs leading-relaxed text-smoke">
                {address.street}
                <br />
                {address.city}, {address.state}
                {address.phone ? (
                  <>
                    <br />
                    {address.phone}
                  </>
                ) : null}
              </p>

              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => makeDefault(address)}
                  className="mt-4 self-start text-[11px] font-semibold text-accent hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit address' : 'Add address'}
      >
        <form onSubmit={save} className="space-y-4">
          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="label" className="label">
                Label
              </label>
              <input
                id="label"
                value={form.label}
                onChange={(event) => update('label', event.target.value)}
                className="input"
                placeholder="Home, Office, etc."
              />
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Phone
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                className="input"
                placeholder="0801 234 5678"
                inputMode="tel"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="street" className="label">
                Street address
              </label>
              <input
                id="street"
                value={form.street}
                onChange={(event) => update('street', event.target.value)}
                className="input"
                placeholder="Street, building, landmark"
              />
            </div>
            <div>
              <label htmlFor="city" className="label">
                City / area
              </label>
              <input
                id="city"
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                className="input"
                placeholder="e.g. Lekki"
              />
            </div>
            <div>
              <label htmlFor="state" className="label">
                State
              </label>
              <select
                id="state"
                value={form.state}
                onChange={(event) => update('state', event.target.value)}
                className="input"
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-smoke">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) => update('isDefault', event.target.checked)}
              className="h-4 w-4 rounded border-line accent-accent"
            />
            Use as my default delivery address
          </label>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline flex-1 text-xs">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? 'Save changes' : 'Add address'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
