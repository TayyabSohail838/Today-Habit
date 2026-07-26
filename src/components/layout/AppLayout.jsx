import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { FloatingActionButton } from "./FloatingActionButton";
import { AddHabitModal } from "../features/habits/AddHabitModal";
import { AssistantWidget } from "../features/assistant/AssistantWidget";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <FloatingActionButton />
      <AddHabitModal />
      {/* AI habit coach — floats above FAB, on all protected pages */}
      <AssistantWidget bottomClass="bottom-24 right-5" />
    </div>
  );
}
