import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LogOut, RefreshCw, ChevronDown, ChevronUp, Mail, Phone, Users, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/data/destinations";
import { TeamWorkspace } from "@/components/TeamWorkspace";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "ctb_admin_token";

const STATUS_STYLES = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  contacted: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  archived: "bg-[#20252E] text-[#9EA6B5] border-[#262B35]",
};

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem(TOKEN_KEY, data.access_token);
      onLogin(data.access_token);
      toast.success("Welcome back");
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error("Sign-in failed", { description: typeof detail === "string" ? detail : "Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0C] flex items-center justify-center px-4">
      <div data-testid="admin-login-form" className="w-full max-w-md border border-[#262B35] rounded-xl bg-[#181B22] p-8">
        <div className="text-center mb-8">
          <p className="text-lg font-extrabold uppercase tracking-tight text-white mb-1">Outdooroots</p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">Team Console</h1>
          <p className="text-sm text-[#9EA6B5] mt-2">Sign in to review inquiries</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="admin-email" className="text-xs text-[#9EA6B5]">Email</Label>
            <Input
              data-testid="admin-email-input"
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chiletravel.com"
              className="mt-1.5 bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password" className="text-xs text-[#9EA6B5]">Password</Label>
            <Input
              data-testid="admin-password-input"
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50"
              required
            />
          </div>
          <button
            data-testid="admin-login-submit"
            type="submit"
            className="w-full py-3 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider disabled:opacity-40"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <Link to="/" data-testid="admin-back-home" className="block text-center text-xs text-[#9EA6B5] hover:text-white transition-colors">
            Back to the builder
          </Link>
        </form>
      </div>
    </div>
  );
}

function BookingCard({ booking, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const b = booking;

  return (
    <div data-testid={`booking-card-${b.id}`} className="border border-[#262B35] rounded-xl bg-[#181B22] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white">{b.package_name}</h3>
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}>
              {b.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#9EA6B5]">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {b.travelers} travelers</span>
            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {b.total_days} days{b.start_date ? ` · from ${format(new Date(b.start_date), "MMM d, yyyy")}` : " · flexible"}</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {b.contact.name} — {b.contact.email}</span>
            {b.contact.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {b.contact.phone}</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white">{formatCurrency(b.total_price)}</div>
          <div className="text-xs text-[#9EA6B5] mt-1">{b.created_at ? format(new Date(b.created_at), "MMM d, yyyy HH:mm") : ""}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Select value={b.status} onValueChange={(val) => onStatusChange(b.id, val)}>
          <SelectTrigger data-testid={`booking-status-select-${b.id}`} className="w-[160px] h-9 bg-[#20252E] border-[#262B35] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#20252E] border-[#262B35]">
            {Object.keys(STATUS_STYLES).map((s) => (
              <SelectItem key={s} value={s} className="capitalize text-white">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          data-testid={`booking-expand-${b.id}`}
          onClick={() => setOpen(!open)}
          className="text-sm text-[#9EA6B5] hover:text-white transition-colors flex items-center gap-1"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {open ? "Hide" : "Details"}
        </button>
      </div>

      {open && (
        <div className="mt-5 pt-5 border-t border-[#262B35] space-y-4">
          {b.destinations.map((d) => (
            <div key={d.id} className="flex justify-between gap-4 text-sm">
              <div>
                <div className="font-semibold text-white">{d.name} · {d.days} days</div>
                <div className="text-xs text-[#9EA6B5] mt-0.5">Stay: {d.accommodation}</div>
                {d.activities.length > 0 && <div className="text-xs text-[#9EA6B5]">Experiences: {d.activities.join(", ")}</div>}
              </div>
              <span className="font-mono text-sm text-white shrink-0">{formatCurrency(d.subtotal)}</span>
            </div>
          ))}
          <div className="border-t border-[#262B35] pt-3 flex justify-between text-sm">
            <span className="text-[#9EA6B5]">Subtotal + est. taxes</span>
            <span className="font-mono text-white">{formatCurrency(b.subtotal)} + {formatCurrency(b.tax)}</span>
          </div>
          {b.contact.notes && (
            <p className="text-sm bg-[#20252E] rounded-lg p-3 text-[#9EA6B5]">
              <span className="font-semibold text-white">Notes: </span>{b.contact.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [bookings, setBookings] = useState(null);

  const load = useCallback(async (t) => {
    try {
      const { data } = await axios.get(`${API}/bookings`, { headers: { Authorization: `Bearer ${t}` } });
      setBookings(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } else {
        toast.error("Could not load bookings");
        setBookings([]);
      }
    }
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/bookings/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setBookings(null);
  };

  if (!token) return <LoginForm onLogin={setToken} />;

  return <TeamWorkspace bookings={bookings} token={token} onReload={() => load(token)} onLogout={logout} />;
}
