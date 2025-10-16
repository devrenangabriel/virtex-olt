import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OltDashboardData } from "./components/OltDashboardData";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center p-4">
        <OltDashboardData />
      </main>
    </QueryClientProvider>
  );
}

export default App;
