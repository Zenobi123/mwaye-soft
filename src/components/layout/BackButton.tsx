import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  to?: string;
  label?: string;
}

/**
 * Bouton "Retour" standardisé (cf. spec dimensions) :
 *   - variante outline, taille sm (h-9 = 36 px)
 *   - icône flèche 16×16 px (h-4 w-4)
 *   - gap icône-libellé : 4 → 8 px (gap-1 sm:gap-2)
 *   - libellé masqué sur mobile (hidden sm:inline)
 *   - ramène par défaut au tableau de bord
 *   - marge inférieure mb-4 (16 px) pour respirer avec le titre
 */
export function BackButton({ to = "/", label = "Retour" }: BackButtonProps) {
  return (
    <Button asChild variant="outline" size="sm" className="w-fit gap-1 sm:gap-2 mb-4">
      <Link to={to}>
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </Button>
  );
}
