import { format } from "date-fns";
import { Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DatePicker = ({ testid, label, date, onSelect, disabled }) => (
  <div>
    <Label className="text-xs">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-testid={testid}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal mt-1.5",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
);

export const SidebarCard = ({ builder }) => {
  const { packageName, setPackageName, travelers, setTravelers, startDate, setStartDate, endDate, setEndDate } = builder;

  return (
    <Card data-testid="package-info-card" className="border-[#E6DFD5]">
      <CardHeader>
        <CardTitle className="font-serif text-xl">The Brief</CardTitle>
        <CardDescription>Name your expedition</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <Label htmlFor="package-name" className="text-xs">Package name</Label>
            <Input
              data-testid="package-name-input"
              id="package-name"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="My Chile Adventure"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-xs">Travelers</Label>
            <div className="flex items-center gap-3 mt-1.5">
              <Button
                data-testid="travelers-minus-button"
                variant="outline"
                size="icon"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                disabled={travelers <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span data-testid="travelers-count" className="min-w-[32px] text-center font-mono">
                {travelers}
              </span>
              <Button
                data-testid="travelers-plus-button"
                variant="outline"
                size="icon"
                onClick={() => setTravelers(Math.min(30, travelers + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              testid="start-date-button"
              label="Start date"
              date={startDate}
              onSelect={setStartDate}
            />
            <DatePicker
              testid="end-date-button"
              label="End date"
              date={endDate}
              onSelect={setEndDate}
              disabled={(d) => (startDate ? d < startDate : false)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
