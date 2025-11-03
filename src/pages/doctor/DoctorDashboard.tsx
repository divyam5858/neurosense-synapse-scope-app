import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, AlertTriangle, ClipboardList, Bell, UserPlus, FileText, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllPatients, mockAssessments } from "@/lib/mockData";
import { useState } from "react";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const patients = getAllPatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "high" | "moderate" | "low">("all");

  const highRiskPatients = patients.filter((p) => {
    const assessment = mockAssessments.find((a) => a.patientId === p.id);
    return assessment?.riskScores.some((r) => r.level === "high");
  });

  const pendingAssessments = mockAssessments.filter((a) => a.status === "pending").length;

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;

    const assessment = mockAssessments.find((a) => a.patientId === patient.id);
    if (!assessment) return false;

    return assessment.riskScores.some((r) => r.level === filterStatus);
  });

  const getPatientRiskLevel = (patientId: string): "high" | "moderate" | "low" | "none" => {
    const assessment = mockAssessments.find((a) => a.patientId === patientId);
    if (!assessment) return "none";

    const hasHigh = assessment.riskScores.some((r) => r.level === "high");
    const hasModerate = assessment.riskScores.some((r) => r.level === "moderate");

    if (hasHigh) return "high";
    if (hasModerate) return "moderate";
    return "low";
  };

  const getLatestAssessment = (patientId: string) => {
    return mockAssessments.find((a) => a.patientId === patientId);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-muted-foreground mt-1">Here's your patient overview</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-risk-high" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-risk-high">{highRiskPatients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Pending Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingAssessments}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-warning" />
                New Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">Unread notifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/doctor/patients">
            <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <UserPlus className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Add New Patient</h3>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/dashboard">
            <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Bell className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">View Alerts</h3>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/diagnostics">
            <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <FileText className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Diagnostics</h3>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/interventions">
            <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Calendar className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Interventions</h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Patient Roster */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Patient Roster</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("high")}
                  >
                    High
                  </Button>
                  <Button
                    variant={filterStatus === "moderate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("moderate")}
                  >
                    Moderate
                  </Button>
                  <Button
                    variant={filterStatus === "low" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("low")}
                  >
                    Low
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.map((patient) => {
                const riskLevel = getPatientRiskLevel(patient.id);
                const assessment = getLatestAssessment(patient.id);

                return (
                  <div
                    key={patient.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {patient.firstName} {patient.lastName}
                          </p>
                          {riskLevel !== "none" && (
                            <Badge
                              variant="outline"
                              className={
                                riskLevel === "high"
                                  ? "border-risk-high text-risk-high"
                                  : riskLevel === "moderate"
                                  ? "border-risk-moderate text-risk-moderate"
                                  : "border-risk-low text-risk-low"
                              }
                            >
                              {riskLevel} risk
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Age: {patient.age} • Gender: {patient.gender} • Blood Type: {patient.bloodType}</p>
                          {assessment && (
                            <div className="flex gap-3">
                              {assessment.riskScores.map((score) => (
                                <span key={score.disease}>
                                  {score.disease}: {score.score}%
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Link to={`/doctor/patient/${patient.id}`}>
                        <Button variant="outline" size="sm" className="w-full md:w-auto">
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        Add Note
                      </Button>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        Schedule
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 border-l-2 border-primary">
                <div className="text-sm text-muted-foreground">2 hours ago</div>
                <div className="flex-1">
                  <p className="font-medium">New assessment completed</p>
                  <p className="text-sm text-muted-foreground">John Smith completed neurological risk assessment</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 border-l-2 border-warning">
                <div className="text-sm text-muted-foreground">5 hours ago</div>
                <div className="flex-1">
                  <p className="font-medium">High risk alert</p>
                  <p className="text-sm text-muted-foreground">Jane Doe's Alzheimer's risk increased to 72%</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 border-l-2 border-muted">
                <div className="text-sm text-muted-foreground">1 day ago</div>
                <div className="flex-1">
                  <p className="font-medium">Follow-up scheduled</p>
                  <p className="text-sm text-muted-foreground">Appointment booked with Robert Johnson</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
