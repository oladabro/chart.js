import React from "react";
import SourceChart from "./components/SourceChart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/global.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SourceChart />
    </QueryClientProvider>
  );
};

export default App;
