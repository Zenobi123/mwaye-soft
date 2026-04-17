import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  to?: string;
  label?: string;
}

/**
 * Bouton "Retour" standardisé.
 * - Toujours en haut à gauche de la zone de contenu.
 * - Variante outline + icône flèche gauche.
 * - Libellé masqué sur mobile.
 * - Ramène par défaut au tableau de bord.
 */
export function BackButton({ to = "/", label = "Retour" }: BackButtonProps) {
  return (
    <Button asChild variant="outline" size="sm" className="w-fit">
      <Link to={to}>
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </Button>
  );
}
