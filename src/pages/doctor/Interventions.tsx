import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, FileText, Pill, TrendingUp, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Interventions = () => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!noteContent || !selectedPatient) {
      toast({
        title: "Missing Information",
        description: "Please select a patient and enter note content",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note Added",
      description: "Clinical note has been saved successfully",
    });
    setNoteContent("");
  };

  // Mock progression data
  const progressionData = [
    { month: "Oct", score: 72 },
    { month: "Nov", score: 70 },
    { month: "Dec", score: 68 },
    { month: "Jan", score: 65 },
    { month: "Feb", score: 63 },
    { month: "Mar (Forecast)", score: 60 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Intervention & Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Track patient progress and manage treatment interventions
          </p>
        </div>

        {/* Add Clinical Note */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Add Clinical Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient-1">John Smith</SelectItem>
                  <SelectItem value="patient-2">Jane Doe</SelectItem>
                  <SelectItem value="patient-3">Robert Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note Type</Label>
              <Select defaultValue="assessment">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="intervention">Intervention</SelectItem>
                  <SelectItem value="general">General Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Clinical Note</Label>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter detailed clinical observations, assessment findings, treatment plans, or recommendations..."
                rows={6}
                className="resize-none"
              />
            </div>

            <Button onClick={handleAddNote} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Clinical Note
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medication Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Medication Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Donepezil</p>
                    <p className="text-sm text-muted-foreground">5mg daily</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Memantine</p>
                    <p className="text-sm text-muted-foreground">10mg twice daily</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Medication
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient-1">John Smith</SelectItem>
                    <SelectItem value="patient-2">Jane Doe</SelectItem>
                    <SelectItem value="patient-3">Robert Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <Input type="date" />
              </div>

              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine Check-up</SelectItem>
                    <SelectItem value="assessment">Cognitive Assessment</SelectItem>
                    <SelectItem value="review">Medication Review</SelectItem>
                    <SelectItem value="counseling">Counseling Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes for the appointment..." rows={3} />
              </div>

              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progression Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Progression Tracking - John Smith
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Alzheimer's Risk Score"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Risk</p>
                <p className="text-2xl font-bold">72%</p>
                <Badge variant="outline" className="mt-2 border-risk-high text-risk-high">
                  High
                </Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Change (30 days)</p>
                <p className="text-2xl font-bold text-risk-low">-7%</p>
                <Badge variant="outline" className="mt-2 border-risk-low text-risk-low">
                  Improving
                </Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">6-Month Forecast</p>
                <p className="text-2xl font-bold">60%</p>
                <Badge variant="outline" className="mt-2 border-risk-moderate text-risk-moderate">
                  Moderate
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Clinical Summary</p>
              <p className="text-sm text-muted-foreground">
                Patient showing positive response to current treatment regimen. Risk score trending downward
                over past 4 months. Continue current medication protocol and recommend increased cognitive
                exercises. Monitor closely for any changes in symptoms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Tool */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Comparison Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Assessment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January 15, 2024</SelectItem>
                    <SelectItem value="2">December 1, 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Second Assessment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January 15, 2024</SelectItem>
                    <SelectItem value="2">December 1, 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Compare Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Interventions;
