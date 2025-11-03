import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskScore } from "@/types";
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  riskScore: RiskScore;
  showTrend?: boolean;
  trend?: "up" | "down" | "stable";
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ riskScore, showTrend, trend = "stable" }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-risk-high border-risk-high/20 bg-risk-high/5";
      case "moderate":
        return "text-risk-moderate border-risk-moderate/20 bg-risk-moderate/5";
      case "low":
        return "text-risk-low border-risk-low/20 bg-risk-low/5";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertCircle className="h-6 w-6" />;
      case "moderate":
        return <AlertTriangle className="h-6 w-6" />;
      case "low":
        return <CheckCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-risk-high" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-risk-low" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn("border-2 transition-all hover:shadow-md", getRiskColor(riskScore.level))}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{riskScore.disease}</span>
          {getRiskIcon(riskScore.level)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{riskScore.score}%</span>
            <span className="text-sm font-medium uppercase tracking-wide">{riskScore.level} RISK</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {riskScore.confidence}% confidence
          </p>
        </div>
        
        {showTrend && (
          <div className="flex items-center gap-2 pt-2 border-t">
            {getTrendIcon()}
            <span className="text-xs text-muted-foreground">
              {trend === "up" ? "Increased" : trend === "down" ? "Decreased" : "Stable"} from last assessment
            </span>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground pt-1">
          Last updated: {new Date(riskScore.lastUpdated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};
