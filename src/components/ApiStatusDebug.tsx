import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getApiCircuitBreakerStatus,
  disableApiCircuitBreaker,
} from "@/lib/api";
import { SUPABASE_CONFIG } from "@/lib/supabaseConfig";
import { RefreshCw, Zap, ZapOff, Activity, AlertTriangle } from "lucide-react";

export const ApiStatusDebug: React.FC = () => {
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState(
    getApiCircuitBreakerStatus(),
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCircuitBreakerStatus(getApiCircuitBreakerStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!SUPABASE_CONFIG.DEBUG_MODE) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90 text-gray-700"
        >
          <Activity className="w-4 h-4 mr-1" />
          API Status
        </Button>
      ) : (
        <Card className="p-4 bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">
              API Status Debug
            </h3>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500"
            >
              ×
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Supabase Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Supabase:</span>
              <Badge
                variant={
                  SUPABASE_CONFIG.ENABLE_SUPABASE ? "default" : "secondary"
                }
              >
                {SUPABASE_CONFIG.ENABLE_SUPABASE ? (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Enabled
                  </>
                ) : (
                  <>
                    <ZapOff className="w-3 h-3 mr-1" />
                    Disabled
                  </>
                )}
              </Badge>
            </div>

            {/* Traditional API Circuit Breaker */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Circuit:</span>
              <Badge
                variant={
                  circuitBreakerStatus.enabled ? "destructive" : "default"
                }
              >
                {circuitBreakerStatus.enabled ? (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Blocked
                  </>
                ) : (
                  <>
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </>
                )}
              </Badge>
            </div>

            {/* Failure Count */}
            {circuitBreakerStatus.consecutiveFailures > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Failures:</span>
                <span className="text-red-600 font-mono text-xs">
                  {circuitBreakerStatus.consecutiveFailures}/
                  {circuitBreakerStatus.maxFailures}
                </span>
              </div>
            )}

            {/* Data Source */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Data Source:</span>
              <Badge variant="outline" className="text-xs">
                {!SUPABASE_CONFIG.ENABLE_SUPABASE ||
                circuitBreakerStatus.enabled
                  ? "Mock Data"
                  : "Live API"}
              </Badge>
            </div>

            {/* Reset Circuit Breaker */}
            {circuitBreakerStatus.enabled && (
              <Button
                onClick={() => {
                  disableApiCircuitBreaker();
                  setCircuitBreakerStatus(getApiCircuitBreakerStatus());
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset Circuit
              </Button>
            )}

            {/* Status Description */}
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              {!SUPABASE_CONFIG.ENABLE_SUPABASE && (
                <p>
                  Supabase disabled. Using mock data to prevent fetch errors.
                </p>
              )}
              {circuitBreakerStatus.enabled && (
                <p>Circuit breaker active due to API failures.</p>
              )}
              {SUPABASE_CONFIG.ENABLE_SUPABASE &&
                !circuitBreakerStatus.enabled && (
                  <p>All systems operational.</p>
                )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
