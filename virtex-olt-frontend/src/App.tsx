import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OltDashboardData } from "./components/OltDashboardData";
import { ToastContainer } from "react-toastify";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <main className="flex min-h-screen flex-col items-center p-4">
          <OltDashboardData />
        </main>
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        pauseOnHover
        pauseOnFocusLoss
        theme="colored"
        className="text-sm"
      />
    </>
  );
}

export default App;
