import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Cible du bouton Retour. Par défaut : tableau de bord ("/"). */
  backTo?: string;
  /** Libellé du bouton Retour (masqué sur mobile). */
  backLabel?: string;
  /** Bouton(s) d'action principale, à droite du titre. */
  action?: ReactNode;
  className?: string;
}

/**
 * En-tête standardisée pour toutes les pages secondaires (cf. spec dimensions).
 * Structure : [Retour] / Titre + Sous-titre / [Action principale]
 *
 *   - Marge inférieure du conteneur : mb-4 sm:mb-8 (16 → 32 px)
 *   - Titre H1 : text-xl sm:text-2xl (20 → 24 px), font-bold, tracking-tight
 *   - Sous-titre : text-xs sm:text-sm (12 → 14 px), masqué sur mobile
 *   - Espacement titre/action : gap-3 (12 px)
 *   - Bouton Retour : variant outline, size sm (36 px), icône 16 px
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
    <div className={cn("mb-4 sm:mb-8", className)}>
      <Button asChild variant="outline" size="sm" className="w-fit gap-1 sm:gap-2 mb-4">
        <Link to={backTo}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
