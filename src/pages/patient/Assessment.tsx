// --- FULLY UPDATED & FIXED FILE ---

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Save, Mic, Volume2, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AssessmentFormData } from "@/types";
import { AudioRecorder } from "@/utils/audioRecorder";
import { supabase } from "@/integrations/supabase/client";

const Assessment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [formData, setFormData] = useState<Partial<AssessmentFormData>>({
    age: 65,
    weight: 70,
    height: 170,
    alcoholConsumption: 0,
    familyHistory: [],
    medicalConditions: [],
    medications: [],
    neurologicalSymptoms: [],
  });

  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalPages = 4;
  const progress = (currentPage / totalPages) * 100;

  // QUESTION ORDER
  const questionOrder = {
    1: ["age", "gender", "weight", "height", "education", "occupation", "languagePreference"],
    2: ["familyHistory", "medicalConditions", "medications", "allergies"],
    3: ["physicalActivity", "sleepQuality", "alcoholConsumption", "smokingStatus", "dietType", "coffeeConsumption", "socialEngagement"],
    4: ["memoryComplaints", "speechIssues", "neurologicalSymptoms", "moodChanges"],
  };

  // KANNADA QUESTIONS
  const kannadaQuestions: Record<string, string> = {
    age: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
    gender: "ನಿಮ್ಮ ಲಿಂಗ ಯಾವುದು?",
    weight: "ನಿಮ್ಮ ತೂಕ ಎಷ್ಟು ಕಿಲೋಗ್ರಾಂ?",
    height: "ನಿಮ್ಮ ಎತ್ತರ ಎಷ್ಟು ಸೆಂಟಿಮೀಟರ್?",
    education: "ನಿಮ್ಮ ವಿದ್ಯಾರ್ಹತೆ ಯಾವುದು?",
    occupation: "ನಿಮ್ಮ ಉದ್ಯೋಗ ಯಾವುದು?",
    languagePreference: "ನಿಮ್ಮ ಭಾಷಾ ಆಯ್ಕೆ ಯಾವುದು?",

    familyHistory: "ನಿಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಯಾವುದೇ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳ ಇತಿಹಾಸ ಇದೆಯೇ?",
    medicalConditions: "ನಿಮಗೆ ಈಗಾಗಲೇ ಇರುವ ಯಾವುದೇ ವೈದ್ಯಕೀಯ ಸಮಸ್ಯೆಗಳಿವೆಯೇ?",
    medications: "ನೀವು ಈಗಾಗಲೇ ತೆಗೆದುಕೊಳ್ಳುವ ಔಷಧಿಗಳಾದರೂ ಇದೆಯೇ?",
    allergies: "ನಿಮಗೆ ಯಾವುದೇ ಅಲರ್ಜಿ ಇದ್ದರೆ ವಿವರಿಸಿ.",

    physicalActivity: "ನಿಮ್ಮ ದೈಹಿಕ ಚಟುವಟಿಕೆ ಮಟ್ಟ ಯಾವುದು?",
    sleepQuality: "ನಿಮ್ಮ ನಿದ್ರೆಯ ಗುಣಮಟ್ಟ ಹೇಗಿದೆ?",
    alcoholConsumption: "ನೀವು ವಾರಕ್ಕೆ ಎಷ್ಟು ಮದ್ಯಪಾನ ಮಾಡುತ್ತೀರಿ?",
    smokingStatus: "ನಿಮ್ಮ ಧೂಮಪಾನ ಸ್ಥಿತಿ ಯಾವುದು?",
    dietType: "ನಿಮ್ಮ ಆಹಾರ ಪದ್ಧತಿ ಯಾವುದು?",
    coffeeConsumption: "ನೀವು ದಿನಕ್ಕೆ ಎಷ್ಟು ಕಾಫಿ ಕುಡಿಯುತ್ತೀರಿ?",
    socialEngagement: "ನಿಮ್ಮ ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆ ಮಟ್ಟ ಯಾವುದು?",

    memoryComplaints: "ನಿಮಗೆ ನೆನಪು ಸಂಬಂಧಿತ ಸಮಸ್ಯೆಗಳಿವೆಯೇ?",
    speechIssues: "ನಿಮಗೆ ಮಾತು ಅಥವಾ ಭಾಷಾ ಸಮಸ್ಯೆಗಳಿವೆಯೇ?",
    neurologicalSymptoms: "ನಿಮಗೆ ಯಾವುದೇ ನ್ಯೂರೋಲಾಜಿಕಲ್ ಲಕ್ಷಣಗಳಿವೆಯೇ?",
    moodChanges: "ನಿಮ್ಮ ಮನೋಭಾವದಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆ ಇರುವುದನ್ನು ಗಮನಿಸಿದ್ದೀರಾ?",
  };

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Ensure currentQuestion is always set and auto-speak when voice mode enabled
  useEffect(() => {
    if (!voiceMode) return;
    const firstKey = questionOrder[currentPage][0];
    setCurrentQuestionIndex(0);
    const questionText = kannadaQuestions[firstKey];
    setCurrentQuestion(questionText);
    
    // Auto-speak first question when voice mode is enabled
    if (voices.length > 0) {
      setTimeout(() => {
        speakQuestion(questionText);
      }, 500);
    }
  }, [voiceMode, currentPage, voices]);

  const handleInputChange = (field: keyof AssessmentFormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCheckboxChange = (field: keyof AssessmentFormData, value: string, checked: boolean) =>
    setFormData((prev) => {
      const arr = (prev[field] as string[]) || [];
      return { ...prev, [field]: checked ? [...arr, value] : arr.filter((v) => v !== value) };
    });

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSubmit = () => {
    toast({
      title: "Assessment Submitted",
      description: "Processing your responses. You'll be redirected to results shortly.",
    });
    setTimeout(() => navigate("/patient/results"), 2000);
  };

  // SPEAK QUESTION
  const speakQuestion = async (text: string) => {
    if (!text || text.trim() === "") {
      toast({ title: "Error", description: "No question available to read.", variant: "destructive" });
      return;
    }

    setIsPlaying(true);

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);

      const knVoice = voices.find((v) => v.lang.startsWith("kn"));
      if (knVoice) u.voice = knVoice;

      u.lang = "kn-IN";
      u.rate = 0.9;

      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(u);
    } catch {
      setIsPlaying(false);
    }
  };

  // EXTRACT FEATURES FROM VOICE
  const extractFeaturesFromVoice = (text: string, fieldKey: string) => {
    const lowerText = text.toLowerCase();
    
    // Number extraction for age, weight, height
    const numbers = text.match(/\d+/g);
    const numValue = numbers ? parseInt(numbers[0]) : null;

    switch (fieldKey) {
      case "age":
      case "weight":
      case "height":
      case "alcoholConsumption":
      case "coffeeConsumption":
        if (numValue) handleInputChange(fieldKey as keyof AssessmentFormData, numValue);
        break;

      case "gender":
        if (lowerText.includes("male") || lowerText.includes("ಗಂಡು")) handleInputChange("gender", "Male");
        else if (lowerText.includes("female") || lowerText.includes("ಹೆಣ್ಣು")) handleInputChange("gender", "Female");
        break;

      case "education":
        if (lowerText.includes("high") || lowerText.includes("ಹೈಸ್ಕೂಲ್")) handleInputChange("education", "high-school");
        else if (lowerText.includes("bachelor") || lowerText.includes("ಪದವಿ")) handleInputChange("education", "bachelors");
        else if (lowerText.includes("master") || lowerText.includes("ಸ್ನಾತಕೋತ್ತರ")) handleInputChange("education", "masters");
        break;

      case "physicalActivity":
        if (lowerText.includes("sedentary") || lowerText.includes("ಕುಳಿತಿರುವ")) handleInputChange("physicalActivity", "sedentary");
        else if (lowerText.includes("light") || lowerText.includes("ಹಗುರ")) handleInputChange("physicalActivity", "light");
        else if (lowerText.includes("moderate") || lowerText.includes("ಮಧ್ಯಮ")) handleInputChange("physicalActivity", "moderate");
        else if (lowerText.includes("active") || lowerText.includes("ಸಕ್ರಿಯ")) handleInputChange("physicalActivity", "active");
        break;

      case "sleepQuality":
        if (lowerText.includes("poor") || lowerText.includes("ಕೆಟ್ಟ")) handleInputChange("sleepQuality", "poor");
        else if (lowerText.includes("fair") || lowerText.includes("ಸರಾಸರಿ")) handleInputChange("sleepQuality", "fair");
        else if (lowerText.includes("good") || lowerText.includes("ಒಳ್ಳೆಯ")) handleInputChange("sleepQuality", "good");
        else if (lowerText.includes("excellent") || lowerText.includes("ಅತ್ಯುತ್ತಮ")) handleInputChange("sleepQuality", "excellent");
        break;

      case "smokingStatus":
        if (lowerText.includes("never") || lowerText.includes("ಎಂದೂ ಇಲ್ಲ")) handleInputChange("smokingStatus", "never");
        else if (lowerText.includes("former") || lowerText.includes("ಹಿಂದೆ")) handleInputChange("smokingStatus", "former");
        else if (lowerText.includes("current") || lowerText.includes("ಈಗ")) handleInputChange("smokingStatus", "current");
        break;

      case "dietType":
        if (lowerText.includes("vegetarian") || lowerText.includes("ಸಸ್ಯಾಹಾರಿ")) handleInputChange("dietType", "vegetarian");
        else if (lowerText.includes("non-veg") || lowerText.includes("ಮಾಂಸಾಹಾರಿ")) handleInputChange("dietType", "non-vegetarian");
        else if (lowerText.includes("vegan") || lowerText.includes("ವೀಗನ್")) handleInputChange("dietType", "vegan");
        break;

      case "socialEngagement":
        if (lowerText.includes("low") || lowerText.includes("ಕಡಿಮೆ")) handleInputChange("socialEngagement", "low");
        else if (lowerText.includes("moderate") || lowerText.includes("ಮಧ್ಯಮ")) handleInputChange("socialEngagement", "moderate");
        else if (lowerText.includes("high") || lowerText.includes("ಹೆಚ್ಚು")) handleInputChange("socialEngagement", "high");
        break;

      case "memoryComplaints":
      case "speechIssues":
        if (lowerText.includes("yes") || lowerText.includes("ಹೌದು") || lowerText.includes("ಇದೆ")) handleInputChange(fieldKey as keyof AssessmentFormData, "yes");
        else if (lowerText.includes("no") || lowerText.includes("ಇಲ್ಲ")) handleInputChange(fieldKey as keyof AssessmentFormData, "no");
        break;

      case "moodChanges":
        handleInputChange("moodChanges", text);
        break;

      case "occupation":
      case "languagePreference":
      case "allergies":
        handleInputChange(fieldKey as keyof AssessmentFormData, text);
        break;

      default:
        break;
    }
  };

  // RECORDING
  const startRecording = async () => {
    await audioRecorder.startRecording();
    setIsRecording(true);
    toast({ title: "Recording Started", description: "Speak your answer in Kannada" });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const base64 = await audioRecorder.stopRecording();

    try {
      const { data, error } = await supabase.functions.invoke("speech-to-text", {
        body: { audio: base64 },
      });

      if (error) throw error;

      const transcribedText = data?.text || "";
      toast({ title: "Success", description: `Transcription: ${transcribedText}` });

      // EXTRACT FEATURES
      const questions = questionOrder[currentPage];
      const currentFieldKey = questions[currentQuestionIndex];
      extractFeaturesFromVoice(transcribedText, currentFieldKey);

      // AUTO-ADVANCE TO NEXT QUESTION
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) {
        const nextKey = questions[nextIndex];
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(kannadaQuestions[nextKey]);
        
        // AUTO-SPEAK NEXT QUESTION
        setTimeout(() => {
          speakQuestion(kannadaQuestions[nextKey]);
        }, 1000);
      } else {
        toast({ 
          title: "Section Complete", 
          description: "All questions answered for this section!",
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to process voice input",
        variant: "destructive" 
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Neurological Risk Assessment</h1>
          <p className="text-muted-foreground mt-1">Page {currentPage} of {totalPages}</p>
        </div>

        {/* VOICE MODE */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Voice Mode (Kannada)</Label>
                <p className="text-sm text-muted-foreground">Listen to questions and respond with your voice</p>
              </div>

              <Switch checked={voiceMode} onCheckedChange={setVoiceMode} />
            </div>

            {voiceMode && (
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-sm font-medium mb-1">Current Question ({currentQuestionIndex + 1}/{questionOrder[currentPage].length}):</p>
                  <p className="text-base">{currentQuestion}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakQuestion(currentQuestion)}
                    disabled={isPlaying || isRecording}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isPlaying ? "Playing..." : "Replay Question"}
                  </Button>

                  {isRecording ? (
                    <Button variant="destructive" size="sm" onClick={stopRecording}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={startRecording}
                      disabled={isPlaying}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Answer via Voice
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PROGRESS */}
        <Progress value={progress} className="h-2" />

        {/* Page 1: Demographics */}
        {currentPage === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Demographics Information</CardTitle>
              <CardDescription>Basic information about you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Age: {formData.age} years</Label>
                <Slider
                  value={[formData.age || 65]}
                  onValueChange={(value) => handleInputChange("age", value[0])}
                  min={18}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", parseInt(e.target.value))}
                    placeholder="70"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", parseInt(e.target.value))}
                    placeholder="170"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="e.g., Engineer, Teacher"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Language Preference</Label>
                  <Select value={formData.languagePreference} onValueChange={(value) => handleInputChange("languagePreference", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page 2: Medical & Family History */}
        {currentPage === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Medical & Family History</CardTitle>
              <CardDescription>Your health history and family background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Family History (Select all that apply)</Label>
                <div className="space-y-2">
                  {["Alzheimer's Disease", "Parkinson's Disease", "Dementia", "Stroke", "Heart Disease"].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.familyHistory?.includes(condition)}
                        onCheckedChange={(checked) => handleCheckboxChange("familyHistory", condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="font-normal cursor-pointer">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Current Medical Conditions</Label>
                <div className="space-y-2">
                  {["Hypertension", "Diabetes", "High Cholesterol", "Depression", "Anxiety", "Thyroid Disorder"].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.medicalConditions?.includes(condition)}
                        onCheckedChange={(checked) => handleCheckboxChange("medicalConditions", condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="font-normal cursor-pointer">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Current Medications</Label>
                <div className="space-y-2">
                  {["Blood Pressure Medication", "Diabetes Medication", "Cholesterol Medication", "Antidepressants", "Pain Relievers", "None"].map((med) => (
                    <div key={med} className="flex items-center space-x-2">
                      <Checkbox
                        id={med}
                        checked={formData.medications?.includes(med)}
                        onCheckedChange={(checked) => handleCheckboxChange("medications", med, checked as boolean)}
                      />
                      <Label htmlFor={med} className="font-normal cursor-pointer">{med}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <Textarea
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  placeholder="List any allergies (medication, food, environmental)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page 3: Lifestyle Factors */}
        {currentPage === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Factors</CardTitle>
              <CardDescription>Information about your daily habits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Physical Activity Level</Label>
                  <Select value={formData.physicalActivity} onValueChange={(value) => handleInputChange("physicalActivity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="active">Very Active (6-7 days/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sleep Quality</Label>
                  <Select value={formData.sleepQuality} onValueChange={(value) => handleInputChange("sleepQuality", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poor">Poor (less than 5 hours)</SelectItem>
                      <SelectItem value="fair">Fair (5-6 hours)</SelectItem>
                      <SelectItem value="good">Good (7-8 hours)</SelectItem>
                      <SelectItem value="excellent">Excellent (8+ hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alcohol Consumption (drinks per week): {formData.alcoholConsumption}</Label>
                <Slider
                  value={[formData.alcoholConsumption || 0]}
                  onValueChange={(value) => handleInputChange("alcoholConsumption", value[0])}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Smoking Status</Label>
                  <Select value={formData.smokingStatus} onValueChange={(value) => handleInputChange("smokingStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never Smoked</SelectItem>
                      <SelectItem value="former">Former Smoker</SelectItem>
                      <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <Select value={formData.dietType} onValueChange={(value) => handleInputChange("dietType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Coffee Consumption</Label>
                  <Select value={formData.coffeeConsumption} onValueChange={(value) => handleInputChange("coffeeConsumption", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consumption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="1-2">1-2 cups/day</SelectItem>
                      <SelectItem value="3-4">3-4 cups/day</SelectItem>
                      <SelectItem value="5+">5+ cups/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Social Engagement</Label>
                  <Select value={formData.socialEngagement} onValueChange={(value) => handleInputChange("socialEngagement", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (rarely socialize)</SelectItem>
                      <SelectItem value="moderate">Moderate (weekly activities)</SelectItem>
                      <SelectItem value="high">High (daily interaction)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page 4: Cognitive & Neurological Symptoms */}
        {currentPage === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Cognitive & Neurological Symptoms</CardTitle>
              <CardDescription>Any symptoms you've been experiencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Memory Complaints</Label>
                <Select value={formData.memoryComplaints} onValueChange={(value) => handleInputChange("memoryComplaints", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mild">Mild (occasional forgetfulness)</SelectItem>
                    <SelectItem value="moderate">Moderate (frequent forgetfulness)</SelectItem>
                    <SelectItem value="severe">Severe (significant impairment)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speech/Language Issues</Label>
                <Select value={formData.speechIssues} onValueChange={(value) => handleInputChange("speechIssues", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mild">Mild (word-finding difficulties)</SelectItem>
                    <SelectItem value="moderate">Moderate (frequent difficulties)</SelectItem>
                    <SelectItem value="severe">Severe (significant impairment)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Neurological Symptoms (Select all that apply)</Label>
                <div className="space-y-2">
                  {[
                    "Tremors or shaking",
                    "Balance problems",
                    "Coordination difficulties",
                    "Stiffness or rigidity",
                    "Slowed movement",
                    "Vision changes",
                    "Headaches",
                    "Dizziness",
                    "None of the above"
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.neurologicalSymptoms?.includes(symptom)}
                        onCheckedChange={(checked) => handleCheckboxChange("neurologicalSymptoms", symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom} className="font-normal cursor-pointer">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mood/Behavior Changes</Label>
                <Textarea
                  value={formData.moodChanges}
                  onChange={(e) => handleInputChange("moodChanges", e.target.value)}
                  placeholder="Describe any mood changes, irritability, depression, anxiety, or personality changes"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentPage < totalPages ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;
