import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { useHabits } from "../contexts/HabitsContext";
import { generateInsights } from "../services/aiService";

export function AIInsights() {
  const { habits, logs } = useHabits();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateInsights({ habits, logs }).then(setInsights);
  }, [habits, logs]);

  return (
    <>
      <Topbar title="AI Insights" />
      <div className="p-6 space-y-4">
        {insights.length === 0 ? (
          <Card><EmptyState icon={Sparkles} title="No insights yet" description="Track a few habits to unlock AI insights." /></Card>
        ) : (
          insights.map((i) => (
            <Card key={i.id}>
              <p className="text-sm">{i.message}</p>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
