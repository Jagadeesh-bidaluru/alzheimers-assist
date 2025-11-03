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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientCard } from "@/components/PatientCard";
import { PatientDetailDialog } from "@/components/PatientDetailDialog";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { DashboardStats } from "@/components/DashboardStats";
import { Patient } from "@/types/patient";
import { Plus, Search, Activity, Globe, Building2 } from "lucide-react";

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Margaret Johnson",
    diagnosisDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    urgency: "critical",
    severity: "severe",
    status: "diagnosed",
    daysSinceDiagnosis: 95,
    location: "Boston, MA",
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
    location: "Boston, MA",
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
    location: "New York, NY",
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
    location: "Boston, MA",
    nextAction: "Monitor progress and schedule follow-up",
  },
  {
    id: "5",
    name: "Linda Davis",
    diagnosisDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    urgency: "critical",
    severity: "severe",
    status: "diagnosed",
    daysSinceDiagnosis: 110,
    location: "Chicago, IL",
    nextAction: "URGENT: Patient at risk of losing eligibility",
  },
  {
    id: "6",
    name: "Michael Brown",
    diagnosisDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    urgency: "high",
    severity: "moderate",
    status: "scheduled",
    daysSinceDiagnosis: 55,
    location: "Los Angeles, CA",
    scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    nextAction: "Confirm travel arrangements for treatment",
  },
  {
    id: "7",
    name: "Sarah Wilson",
    diagnosisDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    urgency: "medium",
    severity: "mild",
    status: "scheduled",
    daysSinceDiagnosis: 30,
    location: "New York, NY",
    scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    nextAction: "Schedule pre-treatment consultation",
  },
  {
    id: "8",
    name: "David Anderson",
    diagnosisDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    urgency: "low",
    severity: "mild",
    status: "in-treatment",
    daysSinceDiagnosis: 15,
    location: "Houston, TX",
    nextAction: "Continue treatment protocol",
  },
  {
    id: "9",
    name: "Jennifer Taylor",
    diagnosisDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    urgency: "critical",
    severity: "severe",
    status: "diagnosed",
    daysSinceDiagnosis: 85,
    location: "Phoenix, AZ",
    nextAction: "URGENT: Schedule consultation immediately",
  },
  {
    id: "10",
    name: "William Thomas",
    diagnosisDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    urgency: "medium",
    severity: "moderate",
    status: "in-treatment",
    daysSinceDiagnosis: 40,
    location: "Boston, MA",
    nextAction: "Monitor treatment response",
  },
];

const DEFAULT_LOCATION = "Boston, MA";

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>(DEFAULT_LOCATION);
  const [viewMode, setViewMode] = useState<"office" | "national">("office");
  const [sortBy, setSortBy] = useState<string>("urgency");

  const handleAddPatient = (patient: Patient) => {
    setPatients([patient, ...patients]);
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailDialogOpen(true);
  };

  const locations = Array.from(new Set(patients.map(p => p.location))).sort();

  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesUrgency =
        filterUrgency === "all" || patient.urgency === filterUrgency;
      const matchesLocation =
        viewMode === "national" || 
        filterLocation === "all" || 
        patient.location === filterLocation;
      return matchesSearch && matchesUrgency && matchesLocation;
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

  const displayPatients = viewMode === "office" 
    ? filteredPatients.filter(p => p.location === filterLocation)
    : filteredPatients;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Care Pathway Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Alzheimer's Treatment Management System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "office" | "national")}>
                <TabsList>
                  <TabsTrigger value="office" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Office View
                  </TabsTrigger>
                  <TabsTrigger value="national" className="gap-2">
                    <Globe className="w-4 h-4" />
                    National View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Patient
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <DashboardStats 
          patients={displayPatients} 
          isNationalView={viewMode === "national"}
          currentLocation={viewMode === "office" ? filterLocation : undefined}
        />

        <div className="bg-card rounded-lg border border-border p-6 my-6">
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
            
            {viewMode === "office" && (
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      📍 {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {viewMode === "national" && (
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      📍 {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Patient List {viewMode === "office" && `- ${filterLocation}`}
            </h2>
            <p className="text-sm text-muted-foreground">
              Showing {displayPatients.length} patient{displayPatients.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => handlePatientClick(patient)}
              />
            ))}
          </div>

          {displayPatients.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">No patients found matching your criteria</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setFilterUrgency("all");
                  setFilterLocation(viewMode === "office" ? DEFAULT_LOCATION : "all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
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
