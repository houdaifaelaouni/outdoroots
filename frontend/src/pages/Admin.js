import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Mountain, LogOut, RefreshCw, ChevronDown, ChevronUp, Mail, Phone, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/data/destinations";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "ctb_admin_token";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
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
      toast.success("Welcome back", { description: "Signed in to the team console." });
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error("Sign-in failed", { description: typeof detail === "string" ? detail : "Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <Card data-testid="admin-login-form" className="w-full max-w-md border-[#E6DFD5]">
        <CardHeader className="text-center">
          <Mountain className="h-8 w-8 mx-auto text-[#0B192C] mb-2" />
          <CardTitle className="font-serif text-3xl">Team Console</CardTitle>
          <CardDescription>Sign in to review incoming booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="text-xs">Email</Label>
              <Input
                data-testid="admin-email-input"
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chiletravel.com"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-password" className="text-xs">Password</Label>
              <Input
                data-testid="admin-password-input"
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5"
                required
              />
            </div>
            <Button data-testid="admin-login-submit" type="submit" className="w-full bg-[#0B192C] hover:bg-[#1E3E62]" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <Link to="/" data-testid="admin-back-home" className="block text-center text-xs text-muted-foreground hover:text-[#0B192C] transition-colors">
              ← Back to the builder
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function BookingCard({ booking, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const b = booking;

  return (
    <Card data-testid={`booking-card-${b.id}`} className="border-[#E6DFD5]">
      <CardContent className="py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-serif text-xl text-[#0B192C]">{b.package_name}</h3>
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}>
                {b.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {b.travelers} travelers</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {b.total_days} days{b.start_date ? ` · from ${format(new Date(b.start_date), "MMM d, yyyy")}` : " · flexible dates"}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {b.contact.name} — {b.contact.email}</span>
              {b.contact.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {b.contact.phone}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="font-serif text-2xl text-[#0B192C]">{formatCurrency(b.total_price)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {b.created_at ? format(new Date(b.created_at), "MMM d, yyyy HH:mm") : ""}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <Select value={b.status} onValueChange={(val) => onStatusChange(b.id, val)}>
            <SelectTrigger data-testid={`booking-status-select-${b.id}`} className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(STATUS_STYLES).map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            data-testid={`booking-expand-${b.id}`}
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {open ? "Hide details" : "View details"}
          </Button>
        </div>

        {open && (
          <div className="mt-5 pt-5 border-t border-[#E6DFD5] space-y-4">
            {b.destinations.map((d) => (
              <div key={d.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <div className="font-medium">{d.name} · {d.days} days</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Stay: {d.accommodation}</div>
                  {d.activities.length > 0 && (
                    <div className="text-xs text-muted-foreground">Experiences: {d.activities.join(", ")}</div>
                  )}
                </div>
                <span className="font-mono text-sm shrink-0">{formatCurrency(d.subtotal)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal + est. taxes</span>
              <span className="font-mono">{formatCurrency(b.subtotal)} + {formatCurrency(b.tax)}</span>
            </div>
            {b.contact.notes && (
              <p className="text-sm bg-[#F6F2EB] rounded-lg p-3 text-[#5C656E]">
                <span className="font-medium text-[#0B192C]">Special requests: </span>{b.contact.notes}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [bookings, setBookings] = useState(null);

  const load = useCallback(async (t) => {
    try {
      const { data } = await axios.get(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${t}` },
      });
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
      await axios.patch(`${API}/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success("Status updated", { description: `Booking marked as ${status}.` });
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

  const pending = (bookings || []).filter((b) => b.status === "pending").length;
  const pipeline = (bookings || []).reduce((s, b) => s + (b.total_price || 0), 0);

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#FDFBF7]">
      <header className="bg-[#0B192C] text-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#D4A373] mb-2">Team console</p>
            <h1 className="font-serif text-4xl tracking-tight">Booking requests</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button data-testid="admin-refresh-button" variant="outline" size="sm" onClick={() => load(token)} className="bg-transparent border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#FDFBF7]/10 hover:text-white">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button data-testid="admin-logout-button" variant="outline" size="sm" onClick={logout} className="bg-transparent border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#FDFBF7]/10 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
            <Link to="/" data-testid="admin-home-link">
              <Button variant="outline" size="sm" className="bg-transparent border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#FDFBF7]/10 hover:text-white">
                Builder →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Requests", value: bookings?.length ?? "—", testid: "admin-stat-total" },
            { label: "Pending", value: bookings ? pending : "—", testid: "admin-stat-pending" },
            { label: "Pipeline value", value: bookings ? formatCurrency(pipeline) : "—", testid: "admin-stat-pipeline" },
          ].map((s) => (
            <Card key={s.label} className="border-[#E6DFD5]">
              <CardContent className="py-5 text-center">
                <div data-testid={s.testid} className="font-serif text-3xl text-[#0B192C]">{s.value}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div data-testid="admin-bookings-list" className="space-y-4">
          {bookings === null && <p className="text-center text-muted-foreground py-16">Loading requests…</p>}
          {bookings?.length === 0 && (
            <Card className="border-dashed border-[#E6DFD5]">
              <CardContent className="py-16 text-center">
                <p className="font-serif text-2xl text-[#0B192C]">No requests yet</p>
                <p className="text-sm text-muted-foreground mt-2">New booking submissions will appear here the moment they arrive.</p>
              </CardContent>
            </Card>
          )}
          {bookings?.map((b) => (
            <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
          ))}
        </div>
      </main>
    </div>
  );
}
