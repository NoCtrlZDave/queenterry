import { useState } from 'react';
import { Loader2, Lock, Save, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profile);
      toast('Profile updated');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword.length < 8) {
      toast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      toast('New passwords do not match.', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await api('/auth/password', {
        method: 'PUT',
        body: {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
      });
      toast('Password updated');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Profile information</h2>
        <p className="mt-1 text-xs text-smoke">
          Used to autofill checkout and contact you about your order.
        </p>

        <form onSubmit={saveProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="p-name" className="label">
              Full name
            </label>
            <input
              id="p-name"
              value={profile.name}
              onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
              className="input"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="p-email" className="label">
              Email
            </label>
            <input
              id="p-email"
              type="email"
              value={profile.email}
              onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
              className="input"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="p-phone" className="label">
              Phone
            </label>
            <input
              id="p-phone"
              value={profile.phone}
              onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
              className="input"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={savingProfile} className="btn-primary text-xs">
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save profile
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-line p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Password & security</h2>
        <p className="mt-1 text-xs text-smoke">
          Use at least 8 characters. Avoid reusing passwords from other websites.
        </p>

        <form onSubmit={savePassword} className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="current" className="label">
              Current password
            </label>
            <input
              id="current"
              type="password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
              className="input"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="new" className="label">
              New password
            </label>
            <input
              id="new"
              type="password"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords((prev) => ({ ...prev, newPassword: event.target.value }))
              }
              className="input"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="label">
              Confirm new
            </label>
            <input
              id="confirm"
              type="password"
              value={passwords.confirm}
              onChange={(event) =>
                setPasswords((prev) => ({ ...prev, confirm: event.target.value }))
              }
              className="input"
              autoComplete="new-password"
            />
          </div>
          <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={savingPassword} className="btn-outline text-xs">
              {savingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Update password
            </button>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-smoke">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Your password is stored securely hashed.
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}
