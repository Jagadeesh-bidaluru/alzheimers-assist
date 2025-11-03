import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Patient, SeverityLevel } from "@/types/patient";
import { toast } from "sonner";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (patient: Patient) => void;
}

export const AddPatientDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddPatientDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    diagnosisDate: "",
    severity: "moderate" as SeverityLevel,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.diagnosisDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const diagnosisDate = new Date(formData.diagnosisDate);
    const today = new Date();
    const daysSinceDiagnosis = Math.floor(
      (today.getTime() - diagnosisDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let urgency: Patient["urgency"] = "low";
    if (daysSinceDiagnosis > 90) urgency = "critical";
    else if (daysSinceDiagnosis > 60) urgency = "high";
    else if (daysSinceDiagnosis > 30) urgency = "medium";

    const newPatient: Patient = {
      id: crypto.randomUUID(),
      name: formData.name,
      diagnosisDate,
      severity: formData.severity,
      urgency,
      status: "diagnosed",
      daysSinceDiagnosis,
      nextAction: "Schedule initial consultation",
      notes: formData.notes || undefined,
    };

    onAdd(newPatient);
    toast.success("Patient added successfully");
    setFormData({
      name: "",
      diagnosisDate: "",
      severity: "moderate",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Patient Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div>
            <Label htmlFor="diagnosisDate">Diagnosis Date *</Label>
            <Input
              id="diagnosisDate"
              type="date"
              value={formData.diagnosisDate}
              onChange={(e) =>
                setFormData({ ...formData, diagnosisDate: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="severity">Severity Level</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: SeverityLevel) =>
                setFormData({ ...formData, severity: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
