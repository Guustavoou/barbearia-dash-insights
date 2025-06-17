import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { autoTestSupabase } from "./lib/supabaseTest";
import "./lib/directSupabaseTest";

// Testar conectividade Supabase na inicialização
autoTestSupabase();

createRoot(document.getElementById("root")!).render(<App />);
