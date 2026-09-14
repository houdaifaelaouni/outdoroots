import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency, getAccommodationById } from "@/data/destinations";

export const DestinationPanel = ({ dest, selected, nights, travelers, onDaysChange, onActivityToggle, onAccommodationSelect, onCustomAccommodation }) => {
  const Icon = dest.icon;
  const selectedAcc =
    selected.accommodation && selected.accommodation !== "custom"
      ? getAccommodationById(dest.id, selected.accommodation)
      : null;
  const subtotal =
    dest.basePrice * selected.days * travelers +
    dest.activities
      .filter((a) => selected.activities.includes(a.id))
      .reduce((s, a) => s + a.price * travelers, 0) +
    (selectedAcc ? selectedAcc.price * nights * travelers : 0);

  return (
    <div data-testid={`destination-panel-${dest.id}`} className="space-y-6">
      <Card className="border-[#E6DFD5]">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#F6F2EB] flex items-center justify-center">
              <Icon className="h-5 w-5 text-[#0B192C]" />
            </div>
            <div>
              <CardTitle className="font-serif text-2xl">{dest.name}</CardTitle>
              <CardDescription>{dest.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-testid={`days-minus-${dest.id}`}
              variant="outline"
              size="icon"
              onClick={() => onDaysChange(dest.id, selected.days - 1)}
              disabled={selected.days <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span data-testid={`days-count-${dest.id}`} className="min-w-[64px] text-center font-mono text-sm">
              {selected.days} days
            </span>
            <Button
              data-testid={`days-plus-${dest.id}`}
              variant="outline"
              size="icon"
              onClick={() => onDaysChange(dest.id, selected.days + 1)}
              disabled={selected.days >= 14}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence mode="wait">
        {selected.days === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="text-center py-14 border-dashed border-[#E6DFD5]">
              <CardContent>
                <Icon className="h-12 w-12 mx-auto text-[#C87D55]/60 mb-4" />
                <h3 className="font-serif text-2xl text-[#0B192C] mb-2">
                  Add {dest.name} to your journey
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Set the days above, or begin with a three-day sketch.
                </p>
                <Button data-testid={`quick-add-${dest.id}`} onClick={() => onDaysChange(dest.id, 3)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add 3 Days
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="filled"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-[#E6DFD5]">
              <CardContent className="pt-6">
                <Label className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Length of stay · {selected.days} days / {nights} nights
                </Label>
                <Slider
                  data-testid={`days-slider-${dest.id}`}
                  value={[selected.days]}
                  onValueChange={(val) => onDaysChange(dest.id, val[0])}
                  max={14}
                  step={1}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
                  <span>0</span>
                  <span>7</span>
                  <span>14</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E6DFD5]">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Experiences</CardTitle>
                <CardDescription>Curated for your {dest.name} chapter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {dest.activities.map((activity) => {
                    const isSelected = selected.activities.includes(activity.id);
                    const ActivityIcon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        data-testid={`activity-${dest.id}-${activity.id}`}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border transition-colors duration-200",
                          isSelected
                            ? "bg-[#F6F2EB] border-[#1E3E62]"
                            : "hover:bg-[#FDFBF7] border-[#E6DFD5]"
                        )}
                      >
                        <Checkbox
                          id={`${dest.id}-${activity.id}`}
                          checked={isSelected}
                          onCheckedChange={() => onActivityToggle(dest.id, activity.id)}
                          className="h-5 w-5"
                        />
                        <Label htmlFor={`${dest.id}-${activity.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">{activity.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {activity.duration} day(s) · {formatCurrency(activity.price)} per person
                          </div>
                        </Label>
                        <div className="flex items-center gap-2">
                          <ActivityIcon className="h-4 w-4 text-[#C87D55]" />
                          <Badge variant={isSelected ? "default" : "secondary"} className="text-[10px]">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E6DFD5]">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Accommodation</CardTitle>
                <CardDescription>
                  Where you'll rest for {nights} night{nights !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    value={selected.accommodation || ""}
                    onValueChange={(val) => onAccommodationSelect(dest.id, val)}
                  >
                    <SelectTrigger data-testid={`accommodation-select-${dest.id}`} className="w-full">
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      {dest.accommodations.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          <span className="flex items-center justify-between gap-6 w-full">
                            <span>
                              <span className="font-medium block">{acc.name}</span>
                              <span className="text-xs text-muted-foreground">{acc.type}</span>
                            </span>
                            <span className="text-right">
                              <span className="font-mono text-sm block">{formatCurrency(acc.price)}/night</span>
                              <span className="text-xs text-muted-foreground">
                                {"★".repeat(acc.rating)}
                              </span>
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        <span className="font-medium">Custom / Other</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {selected.accommodation === "custom" && (
                    <Input
                      data-testid={`custom-accommodation-${dest.id}`}
                      placeholder="Enter accommodation name"
                      value={selected.customAccommodation}
                      onChange={(e) => onCustomAccommodation(dest.id, e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E6DFD5] bg-[#0B192C] text-[#FDFBF7]">
              <CardContent className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8 font-mono text-xs uppercase tracking-[0.2em] text-[#FDFBF7]/60">
                    <span>{selected.days} days</span>
                    <span>{selected.activities.length} experiences</span>
                    <span>{selectedAcc?.name || selected.customAccommodation || "No stay selected"}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D4A373]">
                      Chapter subtotal
                    </div>
                    <div data-testid={`subtotal-${dest.id}`} className="font-serif text-3xl">
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
