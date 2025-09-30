import { Position } from "@/types/position";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock } from "lucide-react";
import { useApplications } from "@/contexts/ApplicationContext";

interface PositionCardProps {
  position: Position;
  onApply: (position: Position) => void;
}

const PositionCard = ({ position, onApply }: PositionCardProps) => {
  const { getAppliedCategories, hasAppliedToPosition } = useApplications();
  const isOpen = position.status === "open";
  
  const appliedCategories = getAppliedCategories(position.id);
  const hasCategories = position.categories && position.categories.length > 0;
  
  const isFullyApplied = hasCategories 
    ? appliedCategories.length === position.categories!.length
    : hasAppliedToPosition(position.id);
  
  const canApply = isOpen && !isFullyApplied;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">{position.title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">{position.department}</span>
          </div>
        </div>
        <Badge
          variant={isOpen ? "default" : "secondary"}
          className={isOpen ? "bg-success hover:bg-success" : ""}
        >
          <Clock className="w-3 h-3 mr-1" />
          {isOpen ? "Abierta" : "Cerrada"}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{position.description}</p>

      {position.categories && position.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {position.categories.map((category) => (
            <Badge key={category} variant="outline" className="capitalize">
              {category}
            </Badge>
          ))}
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Requisitos:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          {position.requirements.map((req, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => onApply(position)}
        disabled={!canApply}
        className="w-full"
        variant={canApply ? "default" : "secondary"}
      >
        {!isOpen ? "No Disponible" : isFullyApplied ? "Ya Postulado" : "Postular"}
      </Button>
    </div>
  );
};

export default PositionCard;
