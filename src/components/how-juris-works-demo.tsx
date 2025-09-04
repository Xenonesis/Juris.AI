"use client";

import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

export const HowJurisWorksDemo = () => {
  return (
    <div className="p-4 rounded-xl bg-accent/20 w-full flex justify-center">
      <DatabaseWithRestApi 
        title="AI-Powered Legal Document Processing"
        circleText="AI"
        badgeTexts={{
          first: "ANALYZE",
          second: "EXTRACT", 
          third: "VALIDATE",
          fourth: "PROCESS"
        }}
        buttonTexts={{
          first: "Juris.AI",
          second: "LegalTech"
        }}
        lightColor="#3B82F6"
        className="mx-auto"
      />
    </div>
  );
};
