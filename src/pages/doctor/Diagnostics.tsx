import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Upload, FileImage, Activity, Play, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Diagnostics = () => {
  const [mriFile, setMriFile] = useState<File | null>(null);
  const [mmseScore, setMmseScore] = useState([24]);
  const [cdrScore, setCdrScore] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMriFile(file);
      toast({
        title: "MRI Uploaded",
        description: `File ${file.name} uploaded successfully`,
      });
    }
  };

  const handleRunDiagnostics = () => {
    toast({
      title: "Analysis Running",
      description: "Processing MRI and clinical data...",
    });
    setTimeout(() => {
      setShowResults(true);
      toast({
        title: "Analysis Complete",
        description: "Diagnostic results are ready",
      });
    }, 3000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Diagnostic Module</h1>
          <p className="text-muted-foreground mt-1">Upload MRI and clinical data for advanced analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MRI Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                MRI Upload
              </CardTitle>
              <CardDescription>Upload brain MRI scans for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="mri-upload"
                  className="hidden"
                  accept=".dcm,.nii,.nii.gz,image/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="mri-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    DICOM, NIfTI, or standard image formats
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Max file size: 100MB</p>
                </label>
              </div>
              {mriFile && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{mriFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(mriFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Badge>Ready</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Data Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Clinical Data Entry
              </CardTitle>
              <CardDescription>Enter patient's clinical assessment scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>MMSE Score: {mmseScore[0]}/30</Label>
                <Slider
                  value={mmseScore}
                  onValueChange={setMmseScore}
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Mini-Mental State Examination (cognitive function)
                </p>
              </div>

              <div className="space-y-2">
                <Label>CDR Score</Label>
                <Select value={cdrScore} onValueChange={setCdrScore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CDR score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - Normal</SelectItem>
                    <SelectItem value="0.5">0.5 - Very Mild Dementia</SelectItem>
                    <SelectItem value="1">1 - Mild Dementia</SelectItem>
                    <SelectItem value="2">2 - Moderate Dementia</SelectItem>
                    <SelectItem value="3">3 - Severe Dementia</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Clinical Dementia Rating</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CSF Tau (pg/mL)</Label>
                  <Input type="number" placeholder="300" />
                </div>
                <div className="space-y-2">
                  <Label>CSF Aβ42 (pg/mL)</Label>
                  <Input type="number" placeholder="500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>APOE ε4 Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No ε4 alleles</SelectItem>
                    <SelectItem value="hetero">Heterozygous (1 allele)</SelectItem>
                    <SelectItem value="homo">Homozygous (2 alleles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Run Analysis Button */}
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handleRunDiagnostics}
              disabled={!mriFile || !cdrScore}
              className="w-full"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Run Full Diagnostic Analysis
            </Button>
            {(!mriFile || !cdrScore) && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Please upload MRI and enter clinical data to run analysis
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {showResults && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Diagnostic Results</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Diagnosis */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Primary Diagnosis</h3>
                <div className="p-4 border-2 border-risk-high/20 bg-risk-high/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xl font-bold">Alzheimer's Disease</p>
                    <Badge className="bg-risk-high">High Probability</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Early to moderate stage</p>
                </div>
              </div>

              {/* Risk Scores */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Disease Probability</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Alzheimer's</p>
                    <p className="text-3xl font-bold text-risk-high">78%</p>
                    <Badge variant="outline" className="mt-2 border-risk-high text-risk-high">
                      High
                    </Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Vascular Dementia</p>
                    <p className="text-3xl font-bold text-risk-moderate">32%</p>
                    <Badge variant="outline" className="mt-2 border-risk-moderate text-risk-moderate">
                      Moderate
                    </Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Frontotemporal</p>
                    <p className="text-3xl font-bold text-risk-low">15%</p>
                    <Badge variant="outline" className="mt-2 border-risk-low text-risk-low">
                      Low
                    </Badge>
                  </div>
                </div>
              </div>

              {/* MRI Findings */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Key MRI Findings</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-risk-high">•</span>
                    <div>
                      <p className="font-medium">Hippocampal Atrophy</p>
                      <p className="text-sm text-muted-foreground">
                        Significant volume reduction in hippocampus (bilateral)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-risk-moderate">•</span>
                    <div>
                      <p className="font-medium">Cortical Thinning</p>
                      <p className="text-sm text-muted-foreground">
                        Temporal and parietal cortex showing decreased thickness
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-risk-moderate">•</span>
                    <div>
                      <p className="font-medium">White Matter Changes</p>
                      <p className="text-sm text-muted-foreground">
                        Moderate periventricular white matter hyperintensities
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Recommendations */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Clinical Recommendations</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">1</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Initiate or adjust cholinesterase inhibitor therapy (Donepezil, Rivastigmine, or
                      Galantamine)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">2</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Consider adding Memantine for moderate stage symptoms
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">3</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Schedule follow-up MRI in 6 months to monitor progression
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">4</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Refer to occupational therapy for activities of daily living support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">5</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Provide caregiver education and support resources
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Diagnostics;
