import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FIELDS = [
  { id: "name", label: "Full name", type: "text", placeholder: "Alexandra Mercer", testid: "contact-name-input" },
  { id: "email", label: "Email", type: "email", placeholder: "alexandra@example.com", testid: "contact-email-input" },
  { id: "phone", label: "Phone (optional)", type: "tel", placeholder: "+1 234 567 890", testid: "contact-phone-input" },
  { id: "notes", label: "Special requests", type: "text", placeholder: "Dietary needs, occasions, accessibility…", testid: "contact-notes-input" },
];

export const ContactCard = ({ contactInfo, setContactInfo }) => (
  <Card data-testid="contact-info-card" className="border-[#E6DFD5]">
    <CardHeader>
      <CardTitle className="font-serif text-xl">Correspondence</CardTitle>
      <CardDescription>Where our team reaches you</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {FIELDS.map((f) => (
        <div key={f.id}>
          <Label htmlFor={`contact-${f.id}`} className="text-xs">{f.label}</Label>
          <Input
            data-testid={f.testid}
            id={`contact-${f.id}`}
            type={f.type}
            value={contactInfo[f.id]}
            onChange={(e) => setContactInfo({ ...contactInfo, [f.id]: e.target.value })}
            placeholder={f.placeholder}
            className="mt-1.5"
          />
        </div>
      ))}
    </CardContent>
  </Card>
);
