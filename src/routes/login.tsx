import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Connexion — MWAYE HOUSE" },
      { name: "description", content: "Connectez-vous à MWAYE HOUSE" },
    ],
  }),
});

function LoginPage() {
  const { signIn, signUp, resetPassword, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate({ to: "/" });
      } else if (mode === "register") {
        await signUp(email, password, fullName);
        setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
        setMode("login");
      } else {
        await resetPassword(email);
        setSuccess("Un email de réinitialisation a été envoyé.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img src={logo} alt="MWAYE HOUSE" className="h-16 w-16 object-contain" />
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">MWAYE HOUSE</h1>
            <p className="text-sm text-muted-foreground">Gestion commerciale</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            {mode === "login" && "Connexion"}
            {mode === "register" && "Créer un compte"}
            {mode === "forgot" && "Mot de passe oublié"}
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-md bg-success/10 p-3 text-sm text-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                required
              />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Chargement..."
                : mode === "login"
                  ? "Se connecter"
                  : mode === "register"
                    ? "Créer le compte"
                    : "Envoyer le lien"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")} className="text-primary hover:underline block mx-auto">
                  Mot de passe oublié ?
                </button>
                <p>
                  Pas encore de compte ?{" "}
                  <button onClick={() => setMode("register")} className="text-primary hover:underline">
                    S'inscrire
                  </button>
                </p>
              </>
            )}
            {(mode === "register" || mode === "forgot") && (
              <button onClick={() => setMode("login")} className="text-primary hover:underline">
                Retour à la connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
