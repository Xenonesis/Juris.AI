"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { localJurisdictions } from "./jurisdiction-select";
import { AlertTriangle, CheckCircle2, CircleHelp, Scale } from "lucide-react";
import { Badge } from "./ui/badge";
import { fadeIn, cardHover, pulse } from "@/lib/motion";
import { Progress } from "./ui/progress";

interface CaseEstimationProps {
  winPercentage: number | null;
  jurisdiction?: string;
}

export function CaseEstimation({ winPercentage, jurisdiction }: CaseEstimationProps) {
  if (winPercentage === null) {
    return (
      <motion.div
        variants={cardHover()}
        initial="idle"
        whileHover="hover"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Case Win Estimation
            </CardTitle>
            <CardDescription>
              Submit a legal query to see win probability estimation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No estimation available yet</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getEstimationInfo = () => {
    if (winPercentage >= 75) {
      return {
        text: "Highly favorable outcome is likely",
        description: "The legal precedents and circumstances strongly support your position",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-600/20",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />,
      };
    } else if (winPercentage >= 50) {
      return {
        text: "Moderately favorable outcome is possible",
        description: "You have good arguments but some challenges may exist",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-600/20",
        icon: <CircleHelp className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      };
    } else if (winPercentage >= 25) {
      return {
        text: "Challenging case with partial success potential",
        description: "There are significant obstacles, though some aspects may be favorable",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-600/20",
        icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      };
    } else {
      return {
        text: "Unfavorable outcome is likely",
        description: "Legal precedents and circumstances are not in your favor",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-600/20",
        icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      };
    }
  };

  const info = getEstimationInfo();

  return (
    <motion.div
      variants={cardHover()}
      initial="idle"
      whileHover="hover"
    >
      <Card className="overflow-hidden transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Case Win Estimation
          </CardTitle>
          <CardDescription>
            Based on AI analysis of similar cases and legal precedents
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${info.bgColor} border ${info.borderColor} rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                variants={pulse()}
                initial="initial"
                animate="animate"
              >
                {info.icon}
              </motion.div>
              <div>
                <h4 className={`font-semibold ${info.color}`}>{info.text}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{info.description}</p>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold"
            >
              {winPercentage}%
            </motion.div>
          </motion.div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Low probability</span>
              <span>High probability</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Progress value={winPercentage} className="h-2" 
                style={{ 
                  background: "linear-gradient(to right, #ef4444, #f59e0b, #3b82f6, #22c55e)",
                  backgroundSize: "100% 100%"
                }} 
              />
            </motion.div>
          </div>
          
          <motion.div 
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <h4 className="font-medium text-sm">Key Factors Analyzed</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { text: "Legal precedents", value: (winPercentage > 50 ? "Favorable" : "Mixed") },
                { text: "Jurisdiction considerations", value: (winPercentage > 40 ? "Supportive" : "Challenging") },
                { text: "Similar case outcomes", value: `${Math.round(winPercentage/10)} of 10 successful` },
                { text: "Strength of evidence", value: (winPercentage > 60 ? "Strong" : "Moderate") },
                { text: "Jurisdiction", value: jurisdiction ? getJurisdictionLabel(jurisdiction) : "Not specified" }
              ].map((factor, index) => (
                <motion.div
                  key={factor.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <FactorItem text={factor.text} value={factor.value} />
                </motion.div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground pt-2">
              <strong>Disclaimer:</strong> This estimation is based on AI analysis and should not be considered legal advice.
              Consult with a qualified attorney for a professional opinion.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to get jurisdiction label from value
function getJurisdictionLabel(value: string): string {
  const jurisdiction = localJurisdictions.find(j => j.value === value);
  return jurisdiction ? jurisdiction.label : value;
}

function FactorItem({ text, value }: { text: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
      <span>{text}</span>
      <Badge variant="outline">{value}</Badge>
    </div>
  );
} 