import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OltDashboardData } from "./components/OltDashboardData";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-r from-red-500 from-40% to-red-950 text-white">
        <OltDashboardData />
      </main>
    </QueryClientProvider>
  );
}

export default App;
