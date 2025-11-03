import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { ArrowLeft, FileText, Calendar, Edit, TrendingUp } from "lucide-react";
import { getPatientById, getAssessmentsByPatientId, getClinicalNotesByPatientId, getMedicationsByPatientId } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const patient = getPatientById(patientId || "");
  const assessments = getAssessmentsByPatientId(patientId || "");
  const clinicalNotes = getClinicalNotesByPatientId(patientId || "");
  const medications = getMedicationsByPatientId(patientId || "");
  const latestAssessment = assessments[0];

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Patient not found</p>
          <Button asChild className="mt-4">
            <Link to="/doctor/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Prepare trend data (mock data showing progression over time)
  const trendData = [
    { month: "Jan", Alzheimer: 65, Parkinson: 30, Dementia: 60 },
    { month: "Feb", Alzheimer: 68, Parkinson: 32, Dementia: 63 },
    { month: "Mar", Alzheimer: 70, Parkinson: 34, Dementia: 66 },
    { month: "Apr", Alzheimer: 72, Parkinson: 35, Dementia: 68 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/doctor/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Age: {patient.age} • Gender: {patient.gender} • Blood Type: {patient.bloodType}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Info
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
          </div>
        </div>

        {/* Patient Demographics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-medium">{patient.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Risk Scores */}
        {latestAssessment && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestAssessment.riskScores.map((score) => (
                <RiskScoreCard key={score.disease} riskScore={score} showTrend trend="up" />
              ))}
            </div>
          </div>
        )}

        {/* Risk Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Progression Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Alzheimer" stroke="hsl(var(--risk-high))" strokeWidth={2} />
                <Line type="monotone" dataKey="Parkinson" stroke="hsl(var(--risk-moderate))" strokeWidth={2} />
                <Line type="monotone" dataKey="Dementia" stroke="hsl(var(--risk-high))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="assessments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessments">Assessment History</TabsTrigger>
            <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>

          {/* Assessments Tab */}
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Risk Assessment</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assessment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>{assessment.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {assessment.riskScores.map((score) => (
                          <div key={score.disease}>
                            <p className="text-sm text-muted-foreground">{score.disease}</p>
                            <p className="text-2xl font-bold">{score.score}%</p>
                            <Badge
                              variant="outline"
                              className={
                                score.level === "high"
                                  ? "border-risk-high text-risk-high"
                                  : score.level === "moderate"
                                  ? "border-risk-moderate text-risk-moderate"
                                  : "border-risk-low text-risk-low"
                              }
                            >
                              {score.level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clinical Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinicalNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{note.doctorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(note.date).toLocaleDateString()} • {note.noteType}
                          </p>
                        </div>
                        <Badge variant="outline">{note.noteType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{med.name}</p>
                          <Badge variant={med.status === "active" ? "default" : "secondary"}>
                            {med.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} - {med.frequency}
                        </p>
                        {med.prescribedBy && (
                          <p className="text-sm text-muted-foreground">Prescribed by: {med.prescribedBy}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Start: {new Date(med.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Family History</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">Father</Badge>
                        <span className="text-muted-foreground">Alzheimer's Disease (diagnosed at 75)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">Mother</Badge>
                        <span className="text-muted-foreground">Hypertension</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Current Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Mild Cognitive Impairment</Badge>
                      <Badge variant="secondary">Hypertension</Badge>
                      <Badge variant="secondary">High Cholesterol</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Allergies</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-risk-high/20 bg-risk-high/5 rounded-lg">
                        <p className="font-medium">Penicillin</p>
                        <p className="text-sm text-muted-foreground">Severe allergic reaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatientDetail;
