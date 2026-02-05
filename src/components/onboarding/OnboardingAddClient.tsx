
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";

interface OnboardingAddClientProps {
  onSkip: () => void;
  onAdded: () => void;
}

export const OnboardingAddClient: React.FC<OnboardingAddClientProps> = ({ onSkip, onAdded }) => {
  const { user } = useSupabaseAuth();
  const { addClient } = useClients(user);

  const [name, setName] = useState("");
  const [rate, setRate] = useState<number>(200);
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    setIsSaving(true);
    const ok = await addClient({
      name: name.trim(),
      hourlyRate: Number.isFinite(rate) ? rate : 0,
      color: undefined,
      email: email.trim() || undefined,
      phone: undefined,
      contactPerson: undefined,
    });
    setIsSaving(false);

    if (ok) {
      toast.success("Client added");
      onAdded();
    } else {
      toast.error("Could not add client");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Add your first client</h2>
        <p className="text-muted-foreground">Create a client to start assigning time and billing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="name">Client name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rivera LLC" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="rate">Hourly rate</Label>
          <Input id="rate" type="number" min={0} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Client email (optional)</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Add client"}
          </Button>
        </div>
      </form>
    </div>
  );
};
