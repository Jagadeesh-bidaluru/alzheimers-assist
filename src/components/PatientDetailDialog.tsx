import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/types/patient";
import { Calendar, Activity, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientDetailDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PatientDetailDialog = ({
  patient,
  open,
  onOpenChange,
}: PatientDetailDialogProps) => {
  if (!patient) return null;

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

  const timelineSteps = [
    { label: "Diagnosis", date: patient.diagnosisDate, completed: true },
    { label: "Treatment Scheduled", date: patient.scheduledDate, completed: patient.status !== "diagnosed" },
    { label: "Treatment Started", completed: patient.status === "in-treatment" || patient.status === "completed" },
    { label: "Treatment Completed", completed: patient.status === "completed" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{patient.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge className={cn("font-medium", getUrgencyColor(patient.urgency))}>
              {patient.urgency.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {patient.severity}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Diagnosis Date</p>
                <p className="font-medium text-foreground">{patient.diagnosisDate.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Days Since Diagnosis</p>
                <p className={cn(
                  "font-medium",
                  patient.daysSinceDiagnosis > 90 ? "text-urgent" : "text-foreground"
                )}>
                  {patient.daysSinceDiagnosis} days
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Care Pathway Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className={cn(
                    "w-4 h-4 rounded-full mt-1 mr-4 flex-shrink-0",
                    step.completed ? "bg-success" : "bg-muted"
                  )} />
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      step.completed ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-sm text-muted-foreground">
                        {step.date.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {patient.nextAction && (
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="flex items-start">
                <FileText className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Next Action Required</p>
                  <p className="text-sm text-foreground">{patient.nextAction}</p>
                </div>
              </div>
            </div>
          )}

          {patient.notes && (
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Notes</h3>
              <p className="text-sm text-muted-foreground">{patient.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
