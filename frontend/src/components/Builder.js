import axios from "axios";
import { toast } from "sonner";
import { Share2, Download, Trash2, Sparkles, Send, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { destinations, formatCurrency } from "@/data/destinations";
import { DestinationPanel } from "@/components/builder/DestinationPanel";
import { SidebarCard } from "@/components/builder/SidebarCard";
import { ContactCard } from "@/components/builder/ContactCard";
import { SummaryPanel } from "@/components/builder/SummaryPanel";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Builder = ({ builder }) => {
  const {
    activeTab, setActiveTab, selectedDestinations, contactInfo, setContactInfo,
    travelers, totalDays, totalActivities, grandTotal, submitting, setSubmitting,
    handleDaysChange, handleActivityToggle, handleAccommodationSelect,
    handleCustomAccommodation, getNights, reset, loadSample, buildPayload,
  } = builder;

  const guardHasSelection = () => {
    if (totalDays === 0) {
      toast.error("No chapters yet", { description: "Add at least one destination with days before continuing." });
      return false;
    }
    return true;
  };

  const handleShare = async () => {
    if (!guardHasSelection()) return;
    const payload = buildPayload();
    const text =
      `${payload.package_name}\n` +
      `${payload.total_days} days · ${payload.travelers} travelers · ${formatCurrency(payload.total_price)}\n` +
      payload.destinations
        .map((d) => `— ${d.name}: ${d.days} days, ${d.accommodation} (${d.activities.join(", ") || "no experiences"})`)
        .join("\n");
    if (navigator.share) {
      try {
        await navigator.share({ title: payload.package_name, text, url: window.location.href });
      } catch (e) { /* dismissed */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n\nCompose yours: ${window.location.href}`);
      toast.success("Copied to clipboard", { description: "Package details ready to share." });
    }
  };

  const handleExport = () => {
    if (!guardHasSelection()) return;
    const data = { package: buildPayload(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chile-package-${data.package.package_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Package exported", { description: "Your composition has been downloaded." });
  };

  const handleReset = () => {
    reset();
    toast.success("Canvas cleared", { description: "Begin a new composition." });
  };

  const handleLoadSample = () => {
    loadSample();
    toast.success("Sample loaded", { description: "Premium Chile Experience — 15 days across all three chapters." });
  };

  const handleSubmit = async () => {
    if (!guardHasSelection()) return;
    if (!contactInfo.name.trim() || !contactInfo.email.trim()) {
      toast.error("Correspondence missing", { description: "Please provide your name and email so our team can reach you." });
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, buildPayload());
      toast.success("Booking request received", {
        description: "Our travel designers will write to you within 24 hours to refine and confirm every detail.",
      });
    } catch (e) {
      const detail = e.response?.data?.detail;
      toast.error("Submission failed", {
        description: typeof detail === "string" ? detail : "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="builder" data-testid="builder-section" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-16">
      <div className="max-w-2xl mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C87D55] mb-4">The atelier</p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#0B192C]">
          Compose your expedition
        </h2>
        <p className="mt-5 text-base text-[#5C656E] leading-relaxed">
          Set the rhythm of each chapter, choose the experiences that call to you, and watch
          the investment take shape live. Our team executes the rest.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <SidebarCard builder={builder} />

          <Card className="border-[#E6DFD5]">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Atelier tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Button data-testid="load-sample-button" variant="outline" className="w-full justify-start" onClick={handleLoadSample}>
                <Sparkles className="h-4 w-4 mr-2 text-[#C87D55]" /> Load a sample composition
              </Button>
              <Button data-testid="share-button" variant="outline" className="w-full justify-start" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2 text-[#C87D55]" /> Share package
              </Button>
              <Button data-testid="export-button" variant="outline" className="w-full justify-start" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2 text-[#C87D55]" /> Export JSON
              </Button>
              <Button data-testid="reset-button" variant="outline" className="w-full justify-start" onClick={handleReset}>
                <Trash2 className="h-4 w-4 mr-2 text-[#C87D55]" /> Reset builder
              </Button>
            </CardContent>
          </Card>

          <ContactCard contactInfo={contactInfo} setContactInfo={setContactInfo} />

          <Button
            data-testid="submit-booking-button"
            className="w-full h-14 text-base font-medium bg-[#0B192C] hover:bg-[#1E3E62] text-[#FDFBF7]"
            onClick={handleSubmit}
            disabled={totalDays === 0 || submitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Sending to our team…" : "Submit for booking"}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Badge variant="secondary" className="text-xs font-mono">
              <Clock className="h-3 w-3 mr-1.5" /> {totalDays} days
            </Badge>
            <Badge variant="secondary" className="text-xs font-mono">
              <Users className="h-3 w-3 mr-1.5" /> {travelers} travelers
            </Badge>
            <Badge data-testid="header-price-badge" className="text-xs font-mono bg-[#0B192C]">
              {formatCurrency(grandTotal)}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-[#F6F2EB]">
              {destinations.map((dest) => {
                const sel = selectedDestinations.find((d) => d.id === dest.id);
                const Icon = dest.icon;
                return (
                  <TabsTrigger
                    key={dest.id}
                    value={dest.id}
                    data-testid={`destination-tab-${dest.id}`}
                    className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 py-3 data-[state=active]:bg-[#0B192C] data-[state=active]:text-[#FDFBF7]"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">{dest.name.split(" & ")[0]}</span>
                    {sel?.days > 0 && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#C87D55] text-white">
                        {sel.days}d
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {destinations.map((dest) => (
              <TabsContent key={dest.id} value={dest.id}>
                <DestinationPanel
                  dest={dest}
                  selected={selectedDestinations.find((d) => d.id === dest.id)}
                  nights={getNights(dest.id)}
                  travelers={travelers}
                  onDaysChange={handleDaysChange}
                  onActivityToggle={handleActivityToggle}
                  onAccommodationSelect={handleAccommodationSelect}
                  onCustomAccommodation={handleCustomAccommodation}
                />
              </TabsContent>
            ))}
          </Tabs>

          <SummaryPanel builder={builder} />
        </div>
      </div>
    </section>
  );
};
