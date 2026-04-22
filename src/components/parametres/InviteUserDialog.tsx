import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Loader2, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { inviteUser } from "@/server/inviteUser.functions";

const ROLE_OPTIONS: Array<{ value: "admin" | "directeur" | "comptable" | "resp_sport" | "resp_evenement" | "resp_immobilier" | "caissier"; label: string }> = [
  { value: "admin", label: "Administrateur" },
  { value: "directeur", label: "Directeur" },
  { value: "comptable", label: "Comptable" },
  { value: "resp_sport", label: "Resp. Sport" },
  { value: "resp_evenement", label: "Resp. Événement" },
  { value: "resp_immobilier", label: "Resp. Immobilier" },
  { value: "caissier", label: "Caissier" },
];

interface Props {
  onCreated: () => void;
}

export function InviteUserDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"invite" | "password">("invite");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<typeof ROLE_OPTIONS[number]["value"]>("caissier");
  const [loading, setLoading] = useState(false);

  const callInvite = useServerFn(inviteUser);

  const reset = () => {
    setEmail(""); setFullName(""); setPassword(""); setRole("caissier"); setMode("invite");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      toast.error("Email et nom requis");
      return;
    }
    if (mode === "password" && password.length < 8) {
      toast.error("Mot de passe : 8 caractères minimum");
      return;
    }
    setLoading(true);
    try {
      const res = await callInvite({
        data: { email, full_name: fullName, role, mode, password: mode === "password" ? password : undefined },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if ("warning" in res && res.warning) toast.warning(res.warning);
      else toast.success(mode === "invite" ? "Invitation envoyée" : "Collaborateur créé");
      reset();
      setOpen(false);
      onCreated();
    } catch (err: unknown) {
      toast.error(err?.message ?? "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter un collaborateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
          <DialogDescription>
            Créez un compte et attribuez un rôle initial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "invite" | "password")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="invite" className="gap-2"><Mail className="h-3.5 w-3.5" />Email d'invitation</TabsTrigger>
              <TabsTrigger value="password" className="gap-2"><KeyRound className="h-3.5 w-3.5" />Mot de passe</TabsTrigger>
            </TabsList>
            <TabsContent value="invite" className="text-xs text-muted-foreground pt-2">
              Le collaborateur reçoit un email pour définir son mot de passe.
            </TabsContent>
            <TabsContent value="password" className="text-xs text-muted-foreground pt-2">
              Vous définissez un mot de passe initial qu'il pourra changer ensuite.
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="invite-name">Nom complet</Label>
            <Input id="invite-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Dupont" required maxLength={120} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@exemple.com" required maxLength={255} />
          </div>

          {mode === "password" && (
            <div className="space-y-2">
              <Label htmlFor="invite-pwd">Mot de passe initial</Label>
              <Input id="invite-pwd" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" minLength={8} maxLength={72} required />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="invite-role">Rôle initial</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger id="invite-role"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Annuler</Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "invite" ? "Envoyer l'invitation" : "Créer le compte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
