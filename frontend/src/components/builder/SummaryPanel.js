import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { destinations, formatCurrency } from "@/data/destinations";

export const SummaryPanel = ({ builder }) => {
  const { breakdown, subtotal, tax, grandTotal, totalDays, totalActivities, travelers, startDate, packageName } = builder;

  return (
    <Card data-testid="package-summary-card" className="mt-10 border-[#E6DFD5] shadow-xl shadow-[#0B192C]/5">
      <CardHeader>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C87D55]">Live estimate</p>
        <CardTitle className="font-serif text-3xl">
          {packageName || `Chile, in ${totalDays || "—"} days`}
        </CardTitle>
        <CardDescription>Every choice reshapes this figure in real time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            {breakdown.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-[#E6DFD5] rounded-lg">
                No chapters selected yet — add days to a destination above.
              </p>
            )}
            {breakdown.map((b) => {
              const dest = destinations.find((d) => d.id === b.id);
              const Icon = dest.icon;
              return (
                <div
                  key={b.id}
                  data-testid={`summary-destination-${b.id}`}
                  className="flex items-center justify-between p-4 bg-[#F6F2EB]/60 rounded-lg border border-[#E6DFD5]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#C87D55]" />
                    <div>
                      <div className="font-medium text-sm">{b.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.days} days · {b.activities.length} experiences ·{" "}
                        {b.accommodation?.name || b.customAccommodation || "stay TBD"}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(b.subtotal)}</span>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Days", value: totalDays, testid: "summary-total-days" },
              { label: "Travelers", value: travelers, testid: "summary-travelers" },
              { label: "Experiences", value: totalActivities, testid: "summary-total-activities" },
              {
                label: "Departure",
                value: startDate ? format(startDate, "MMM d, yyyy") : "Flexible",
                testid: "summary-start-date",
              },
            ].map((item) => (
              <div key={item.label}>
                <div data-testid={item.testid} className="font-serif text-xl text-[#0B192C]">
                  {item.value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span data-testid="summary-subtotal" className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxes & service (est. 19%)</span>
              <span data-testid="summary-tax" className="font-mono">{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-xl">Total investment</span>
              <span data-testid="grand-total-display" className="font-serif text-3xl text-[#0B192C]">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
