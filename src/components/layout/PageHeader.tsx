import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Cible du bouton Retour. Par défaut: tableau de bord ("/"). */
  backTo?: string;
  /** Libellé du bouton Retour (masqué sur mobile). */
  backLabel?: string;
  /** Bouton(s) d'action principale, à droite du titre. */
  action?: ReactNode;
  className?: string;
}

/**
 * En-tête standardisée pour toutes les pages secondaires.
 * Structure : [Retour] / Titre + Sous-titre / [Action principale]
 *
 * Cohérence transversale :
 *   - Bouton Retour toujours en haut à gauche, variante outline, icône flèche.
 *   - Action principale toujours en haut à droite.
 *   - Sous-titre masqué sur mobile pour économiser l'espace vertical.
 */
export function PageHeader({
  title,
  subtitle,
  backTo = "/",
  backLabel = "Retour",
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link to={backTo}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="hidden sm:block text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
