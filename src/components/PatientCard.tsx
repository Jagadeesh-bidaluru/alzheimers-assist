import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Patient } from "@/types/patient";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  const getUrgencyColor = (urgency: Patient["urgency"]) => {
    switch (urgency) {
      case "critical":
        return "bg-urgent text-urgent-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-primary/20 text-primary";
      default:
        return "bg-success/20 text-success";
    }
  };

  const getSeverityColor = (severity: Patient["severity"]) => {
    switch (severity) {
      case "severe":
        return "border-urgent";
      case "moderate":
        return "border-warning";
      default:
        return "border-border";
    }
  };

  const getStatusLabel = (status: Patient["status"]) => {
    switch (status) {
      case "diagnosed":
        return "Diagnosed";
      case "scheduled":
        return "Scheduled";
      case "in-treatment":
        return "In Treatment";
      case "completed":
        return "Completed";
    }
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4",
        getSeverityColor(patient.severity)
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{patient.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{getStatusLabel(patient.status)}</p>
        </div>
        <Badge className={cn("font-medium", getUrgencyColor(patient.urgency))}>
          {patient.urgency.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Diagnosed: {patient.diagnosisDate.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className={cn(
            "font-medium",
            patient.daysSinceDiagnosis > 90 ? "text-urgent" : "text-foreground"
          )}>
            {patient.daysSinceDiagnosis} days since diagnosis
          </span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
            📍 {patient.location}
          </span>
        </div>

        {patient.nextAction && (
          <div className="flex items-start text-sm mt-3 pt-3 border-t border-border">
            <AlertCircle className="w-4 h-4 mr-2 text-primary mt-0.5" />
            <span className="text-foreground font-medium">{patient.nextAction}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
