import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, User, Pill, ClipboardList, FileText, Activity } from "lucide-react";
import { getMedicationsByPatientId, getAssessmentsByPatientId } from "@/lib/mockData";

const EHR = () => {
  const { user } = useAuth();
  const medications = getMedicationsByPatientId(user?.id || "");
  const assessments = getAssessmentsByPatientId(user?.id || "");

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Electronic Health Records</h1>
            <p className="text-muted-foreground mt-1">Your complete medical information</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Full EHR
          </Button>
        </div>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{user?.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{user?.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="font-medium">{user?.bloodType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="medications">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="allergies">
              <ClipboardList className="h-4 w-4 mr-2" />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="history">
              <Activity className="h-4 w-4 mr-2" />
              Medical History
            </TabsTrigger>
            <TabsTrigger value="assessments">
              <FileText className="h-4 w-4 mr-2" />
              Assessments
            </TabsTrigger>
          </TabsList>

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
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
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
                          <p className="text-sm text-muted-foreground">
                            Prescribed by: {med.prescribedBy}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Start: {new Date(med.startDate).toLocaleDateString()}</p>
                        {med.endDate && <p>End: {new Date(med.endDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Allergies Tab */}
          <TabsContent value="allergies">
            <Card>
              <CardHeader>
                <CardTitle>Known Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-risk-high/20 bg-risk-high/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-risk-high flex-shrink-0" />
                      <div>
                        <p className="font-medium">Penicillin</p>
                        <p className="text-sm text-muted-foreground">Severe allergic reaction, rash and difficulty breathing</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-risk-moderate/20 bg-risk-moderate/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-risk-moderate flex-shrink-0" />
                      <div>
                        <p className="font-medium">Pollen</p>
                        <p className="text-sm text-muted-foreground">Seasonal allergies, sneezing and congestion</p>
                      </div>
                    </div>
                  </div>
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
                    <h4 className="font-medium mb-3">Previous Surgeries</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="font-medium">Appendectomy</p>
                        <p className="text-muted-foreground">1995 - Routine removal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessment History Tab */}
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Risk Assessment</h4>
                        <Badge>{assessment.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        {assessment.riskScores.map((score) => (
                          <div key={score.disease}>
                            <p className="text-sm text-muted-foreground">{score.disease}</p>
                            <p className="text-lg font-bold">{score.score}%</p>
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
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(assessment.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EHR;
