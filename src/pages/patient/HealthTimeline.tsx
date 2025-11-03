import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Calendar, FileText, Pill, ClipboardList, UserCheck } from "lucide-react";
import { getHealthEventsByPatientId } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const HealthTimeline = () => {
  const { user } = useAuth();
  const events = getHealthEventsByPatientId(user?.id || "");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEvents = filterType === "all" 
    ? events 
    : events.filter(e => e.type === filterType);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <FileText className="h-5 w-5" />;
      case "medication":
        return <Pill className="h-5 w-5" />;
      case "note":
        return <ClipboardList className="h-5 w-5" />;
      case "follow-up":
        return <UserCheck className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "bg-risk-high text-risk-high border-risk-high";
      case "moderate":
        return "bg-risk-moderate text-risk-moderate border-risk-moderate";
      case "low":
        return "bg-risk-low text-risk-low border-risk-low";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Health Timeline</h1>
            <p className="text-muted-foreground mt-1">Your complete medical history</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="assessment">Assessments</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="note">Doctor Notes</SelectItem>
                <SelectItem value="follow-up">Follow-ups</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-5 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center",
                  getSeverityColor(event.severity)
                )}>
                  {getEventIcon(event.type)}
                </div>

                <Card className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge variant="outline" className="capitalize">
                            {event.type}
                          </Badge>
                          {event.severity && (
                            <Badge 
                              variant="outline"
                              className={cn("capitalize", getSeverityColor(event.severity))}
                            >
                              {event.severity} risk
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        {event.disease && (
                          <p className="text-sm font-medium text-primary">Related to: {event.disease}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                        <p>{new Date(event.date).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events found for this filter</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default HealthTimeline;
