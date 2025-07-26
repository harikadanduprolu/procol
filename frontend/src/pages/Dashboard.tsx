// frontend/src/pages/Dashboard.tsx
import { DashboardLayout } from "@/components/DashboardLayout";
import ApplicationStatusComponent from "@/components/ApplicationStatusComponent";
import ActiveDaysComponent from "@/components/ActiveDaysComponent";

const Dashboard = () => (
  <DashboardLayout>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <ApplicationStatusComponent />
      <ActiveDaysComponent />
    </div>
  </DashboardLayout>
);

export default Dashboard;
