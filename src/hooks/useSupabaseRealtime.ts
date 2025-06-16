import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useSupabaseRealtime<T>(table: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { data: initialData, error } = await supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setData(initialData || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: table,
          },
          (payload) => {
            console.log(`📡 Real-time update for ${table}:`, payload);

            switch (payload.eventType) {
              case "INSERT":
                setData((current) => [payload.new as T, ...current]);
                break;

              case "UPDATE":
                setData((current) =>
                  current.map((item: any) =>
                    item.id === payload.new.id ? payload.new : item,
                  ),
                );
                break;

              case "DELETE":
                setData((current) =>
                  current.filter((item: any) => item.id !== payload.old.id),
                );
                break;
            }
          },
        )
        .subscribe();
    };

    fetchInitialData();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table]);

  return { data, loading, error, setData };
}

// Specific hooks for each table
export const useClients = () => useSupabaseRealtime("clients");
export const useAppointments = () => useSupabaseRealtime("appointments");
export const useProfessionals = () => useSupabaseRealtime("professionals");
export const useServices = () => useSupabaseRealtime("services");
export const useProducts = () => useSupabaseRealtime("products");
export const useTransactions = () => useSupabaseRealtime("transactions");
