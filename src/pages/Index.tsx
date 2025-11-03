import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientCard } from "@/components/PatientCard";
import { PatientDetailDialog } from "@/components/PatientDetailDialog";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { Patient } from "@/types/patient";
import { Plus, Search, Activity } from "lucide-react";

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Margaret Johnson",
    diagnosisDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    urgency: "critical",
    severity: "severe",
    status: "diagnosed",
    daysSinceDiagnosis: 95,
    nextAction: "URGENT: Schedule infusion appointment immediately",
    notes: "Family contacted but no response yet",
  },
  {
    id: "2",
    name: "Robert Chen",
    diagnosisDate: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000),
    urgency: "high",
    severity: "moderate",
    status: "scheduled",
    daysSinceDiagnosis: 72,
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    nextAction: "Confirm appointment scheduled for next week",
  },
  {
    id: "3",
    name: "Patricia Williams",
    diagnosisDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    urgency: "medium",
    severity: "moderate",
    status: "scheduled",
    daysSinceDiagnosis: 45,
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    nextAction: "Follow up on insurance authorization",
  },
  {
    id: "4",
    name: "James Martinez",
    diagnosisDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    urgency: "low",
    severity: "mild",
    status: "in-treatment",
    daysSinceDiagnosis: 20,
    nextAction: "Monitor progress and schedule follow-up",
  },
];

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("urgency");

  const handleAddPatient = (patient: Patient) => {
    setPatients([patient, ...patients]);
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailDialogOpen(true);
  };

  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesUrgency =
        filterUrgency === "all" || patient.urgency === filterUrgency;
      return matchesSearch && matchesUrgency;
    })
    .sort((a, b) => {
      if (sortBy === "urgency") {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      } else if (sortBy === "days") {
        return b.daysSinceDiagnosis - a.daysSinceDiagnosis;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const stats = {
    total: patients.length,
    critical: patients.filter((p) => p.urgency === "critical").length,
    high: patients.filter((p) => p.urgency === "high").length,
    atRisk: patients.filter((p) => p.daysSinceDiagnosis > 90).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Care Pathway Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Alzheimer's Treatment Management
                </p>
              </div>
            </div>
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-urgent/30">
            <p className="text-sm text-muted-foreground mb-1">Critical</p>
            <p className="text-3xl font-bold text-urgent">{stats.critical}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-warning/30">
            <p className="text-sm text-muted-foreground mb-1">High Priority</p>
            <p className="text-3xl font-bold text-warning">{stats.high}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">At Risk (&gt;90d)</p>
            <p className="text-3xl font-bold text-foreground">{stats.atRisk}</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgency">Sort by Urgency</SelectItem>
                <SelectItem value="days">Days Since Diagnosis</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients found matching your criteria</p>
          </div>
        )}
      </main>

      <PatientDetailDialog
        patient={selectedPatient}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <AddPatientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddPatient}
      />
    </div>
  );
};

export default Index;
