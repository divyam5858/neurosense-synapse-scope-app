import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Download, Share2, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssessmentsByPatientId } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const AssessmentResults = () => {
  const { user } = useAuth();
  const assessments = getAssessmentsByPatientId(user?.id || "");
  const latestAssessment = assessments[0];

  if (!latestAssessment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No assessment results found</p>
          <Button asChild className="mt-4">
            <Link to="/patient/assessment">Start Assessment</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Prepare chart data
  const pieData = latestAssessment.riskScores.map((score) => ({
    name: score.disease,
    value: score.score,
    color:
      score.level === "high"
        ? "hsl(var(--risk-high))"
        : score.level === "moderate"
        ? "hsl(var(--risk-moderate))"
        : "hsl(var(--risk-low))",
  }));

  const barData = latestAssessment.topRiskFactors || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assessment Results</h1>
            <p className="text-muted-foreground mt-1">
              Completed on {new Date(latestAssessment.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Doctor
            </Button>
          </div>
        </div>

        {/* Risk Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestAssessment.riskScores.map((score) => (
            <RiskScoreCard key={score.disease} riskScore={score} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="factor" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="impact" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Interpretation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI-Generated Interpretation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{latestAssessment.aiInterpretation}</p>
          </CardContent>
        </Card>

        {/* Clinical Recommendations */}
        {latestAssessment.recommendations && latestAssessment.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Clinical Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {latestAssessment.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{i + 1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button asChild className="flex-1">
            <Link to="/patient/assessment">
              <FileText className="h-4 w-4 mr-2" />
              Start Another Assessment
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/patient/timeline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Health Timeline
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentResults;
