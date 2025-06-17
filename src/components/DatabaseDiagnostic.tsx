import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Database,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Download,
} from "lucide-react";
import {
  DatabaseStatusChecker,
  DatabaseStatus,
  checkDatabaseQuickly,
} from "../tests/database-status-checker";

export const DatabaseDiagnostic: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [report, setReport] = useState<string>("");
  const [fixes, setFixes] = useState<string[]>([]);

  useEffect(() => {
    // Check database status on component mount
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const checker = new DatabaseStatusChecker();
      const dbStatus = await checker.checkDatabaseStatus();
      const statusReport = await checker.generateStatusReport();
      const fixInstructions = await checker.getQuickFixInstructions();

      setStatus(dbStatus);
      setReport(statusReport);
      setFixes(fixInstructions);
    } catch (error) {
      console.error("Error checking database status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `database-status-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (isGood: boolean) =>
    isGood ? "text-green-600" : "text-red-600";

  const getStatusIcon = (isGood: boolean) =>
    isGood ? CheckCircle : AlertCircle;

  if (isChecking) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-blue-800">
              Checking database status...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-600">No database status available</p>
            <Button onClick={checkStatus} className="mt-3">
              Check Database
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallHealthy =
    status.connected &&
    status.tablesExist &&
    status.hasData &&
    status.multiTenantReady;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card
        className={`${
          overallHealthy
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${
              overallHealthy ? "text-green-800" : "text-red-800"
            }`}
          >
            <Database className="w-6 h-6" />
            Database Status{" "}
            {overallHealthy ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
          </CardTitle>
          <CardDescription>
            {overallHealthy
              ? "Database is fully operational and ready for production"
              : "Database requires attention - issues detected"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getStatusColor(status.connected)}`}
              >
                {status.connected ? "✅" : "❌"}
              </div>
              <p className="text-sm text-gray-600">Connection</p>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getStatusColor(status.tablesExist)}`}
              >
                {status.tablesExist ? "✅" : "❌"}
              </div>
              <p className="text-sm text-gray-600">Tables</p>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getStatusColor(status.hasData)}`}
              >
                {status.hasData ? "✅" : "❌"}
              </div>
              <p className="text-sm text-gray-600">Data</p>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getStatusColor(status.multiTenantReady)}`}
              >
                {status.multiTenantReady ? "✅" : "❌"}
              </div>
              <p className="text-sm text-gray-600">Multi-Tenant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {status.error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Error:</strong> {status.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Fixes */}
      {fixes.length > 0 && !overallHealthy && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Quick Fix Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {fixes.map((fix, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{fix}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Table Details */}
      <Card>
        <CardHeader>
          <CardTitle>Table Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status.details.tables).map(([table, exists]) => {
              const count = status.details.recordCounts[table];
              return (
                <div
                  key={table}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {exists ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">{table}</span>
                  </div>
                  <Badge variant={exists ? "default" : "destructive"}>
                    {exists ? `${count} records` : "Missing"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Businesses */}
      {status.details.businesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Businesses (Multi-Tenant)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.details.businesses.map((business, index) => (
                <div
                  key={business.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{business.name}</p>
                    <p className="text-sm text-gray-600">
                      {business.business_type || "Unknown type"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      business.subscription_status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {business.subscription_status || "Unknown"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={checkStatus} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>

            <Button
              onClick={() => window.open("https://app.supabase.com/", "_blank")}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Supabase
            </Button>

            <Button
              onClick={() =>
                copyToClipboard(
                  `-- Quick database status check\nSELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`,
                )
              }
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy SQL Check
            </Button>

            <Button onClick={downloadReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SQL Fix */}
      {!overallHealthy && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              🚨 Database Fix Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-800">
                Your database needs to be fixed. Follow these steps:
              </p>
              <ol className="space-y-2 text-sm">
                <li>
                  1. Go to{" "}
                  <a
                    href="https://app.supabase.com/"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>2. Select your project</li>
                <li>3. Go to SQL Editor</li>
                <li>
                  4. Copy and run the content from URGENT_DATABASE_FIX.sql
                </li>
                <li>5. Refresh this page to verify the fix</li>
              </ol>
              <Button
                onClick={() =>
                  copyToClipboard(
                    "Check the URGENT_DATABASE_FIX.sql file in your project root",
                  )
                }
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Fix Instructions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {overallHealthy && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Database is Healthy!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              🎉 Your database is fully operational with multi-tenant support.
              All tables exist with proper data and the application should work
              correctly.
            </p>
            <div className="mt-4">
              <p className="text-sm text-green-600">
                Total records:{" "}
                {Object.values(status.details.recordCounts).reduce(
                  (sum, count) => sum + count,
                  0,
                )}
              </p>
              <p className="text-sm text-green-600">
                Businesses: {status.details.businesses.length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
