import { useApplications } from "@/contexts/ApplicationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const MyApplications = () => {
  const { applications, cancelApplication } = useApplications();

  const activeApplications = applications.filter((app) => app.status === "pending");

  const handleCancel = (id: string, title: string) => {
    cancelApplication(id);
    toast.success(`Postulación a ${title} cancelada`);
  };

  if (activeApplications.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No tienes postulaciones activas
        </h3>
        <p className="text-muted-foreground">
          Comienza a postular a las ayudantías disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Mis Postulaciones</h2>
        <Badge variant="outline" className="text-base">
          {activeApplications.length} {activeApplications.length === 1 ? 'postulación' : 'postulaciones'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeApplications.map((application) => (
          <div
            key={application.id}
            className="bg-gradient-to-br from-card to-card/80 border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
                  {application.positionTitle}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Building2 className="w-3 h-3" />
                  <span>{application.department}</span>
                </div>
              </div>
              <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 shrink-0">
                Pendiente
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mb-3 text-xs">
              <Calendar className="w-3 h-3" />
              <span>
                {format(application.submittedAt, "d 'de' MMM, yyyy", { locale: es })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {application.category && (
                <div className="bg-accent/10 rounded px-2 py-1">
                  <p className="text-xs text-muted-foreground">Categoría</p>
                  <p className="text-sm font-medium text-foreground capitalize">{application.category}</p>
                </div>
              )}
              <div className="bg-primary/10 rounded px-2 py-1">
                <p className="text-xs text-muted-foreground">Paralelo</p>
                <p className="text-sm font-medium text-foreground">{application.section}</p>
              </div>
            </div>

            <div className="mb-3 bg-muted/50 rounded p-2">
              <p className="text-xs font-medium text-foreground mb-1">Motivo:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{application.reason}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancel(application.id, application.positionTitle)}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              <X className="w-3 h-3 mr-2" />
              Cancelar Postulación
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
