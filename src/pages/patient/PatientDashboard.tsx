import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { FileText, Activity, ClipboardList, User, Calendar, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssessmentsByPatientId } from "@/lib/mockData";

const PatientDashboard = () => {
  const { user } = useAuth();
  const assessments = getAssessmentsByPatientId(user?.id || "");
  const latestAssessment = assessments[0];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground mt-1">Here's your health overview</p>
        </div>

        {/* Risk Score Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Risk Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestAssessment?.riskScores.map((score) => (
              <RiskScoreCard key={score.disease} riskScore={score} showTrend trend="stable" />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/patient/assessment">
              <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <FileText className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold">Start Assessment</h3>
                  <p className="text-sm text-muted-foreground">Begin new risk evaluation</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/patient/timeline">
              <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Activity className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold">Health Timeline</h3>
                  <p className="text-sm text-muted-foreground">View your history</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/patient/ehr">
              <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <ClipboardList className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold">My EHR</h3>
                  <p className="text-sm text-muted-foreground">Electronic health records</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/patient/profile">
              <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <User className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold">My Profile</h3>
                  <p className="text-sm text-muted-foreground">Personal information</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Latest Assessment Details */}
        {latestAssessment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Latest Assessment
                </CardTitle>
                <CardDescription>
                  Completed on {new Date(latestAssessment.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">AI Interpretation</h4>
                  <p className="text-sm text-muted-foreground">{latestAssessment.aiInterpretation}</p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/patient/results">View Full Results</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Doctor's Notes & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestAssessment.doctorNotes && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Clinical Notes</h4>
                    <p className="text-sm text-muted-foreground">{latestAssessment.doctorNotes}</p>
                  </div>
                )}
                {latestAssessment.recommendations && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {latestAssessment.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientDashboard;
