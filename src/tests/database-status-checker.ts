import { supabase } from "../lib/supabase";

export interface DatabaseStatus {
  connected: boolean;
  tablesExist: boolean;
  hasData: boolean;
  multiTenantReady: boolean;
  error?: string;
  details: {
    tables: { [tableName: string]: boolean };
    recordCounts: { [tableName: string]: number };
    businesses: any[];
  };
}

export class DatabaseStatusChecker {
  async checkDatabaseStatus(): Promise<DatabaseStatus> {
    console.log("🔍 Checking database status...");

    const status: DatabaseStatus = {
      connected: false,
      tablesExist: false,
      hasData: false,
      multiTenantReady: false,
      details: {
        tables: {},
        recordCounts: {},
        businesses: [],
      },
    };

    try {
      // Test basic connection
      console.log("Testing connection...");
      const { data, error } = await supabase
        .from("businesses")
        .select("count", { count: "exact", head: true });

      if (error) {
        throw new Error(`Connection failed: ${error.message}`);
      }

      status.connected = true;
      console.log("✅ Connected to Supabase");

      // Check if required tables exist
      const requiredTables = [
        "businesses",
        "clients",
        "appointments",
        "services",
        "professionals",
        "products",
        "transactions",
      ];

      const tableChecks = await Promise.allSettled(
        requiredTables.map(async (table) => {
          try {
            const { count, error } = await supabase
              .from(table)
              .select("*", { count: "exact", head: true });

            if (error) throw error;

            status.details.tables[table] = true;
            status.details.recordCounts[table] = count || 0;
            return { table, exists: true, count: count || 0 };
          } catch (error) {
            status.details.tables[table] = false;
            status.details.recordCounts[table] = 0;
            return { table, exists: false, count: 0 };
          }
        }),
      );

      // Analyze table check results
      const existingTables = tableChecks
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as any).value)
        .filter((result) => result.exists);

      status.tablesExist = existingTables.length === requiredTables.length;

      if (status.tablesExist) {
        console.log(`✅ All ${requiredTables.length} required tables exist`);

        // Check if we have data
        const totalRecords = Object.values(status.details.recordCounts).reduce(
          (sum, count) => sum + count,
          0,
        );
        status.hasData = totalRecords > 0;

        // Check businesses and multi-tenant setup
        const { data: businesses, error: businessError } = await supabase
          .from("businesses")
          .select("*");

        if (!businessError && businesses) {
          status.details.businesses = businesses;
          status.multiTenantReady = businesses.length > 0;

          console.log(`✅ Found ${businesses.length} businesses:`);
          businesses.forEach((business) => {
            console.log(`  - ${business.name} (${business.id})`);
          });
        }
      } else {
        const missingTables = requiredTables.filter(
          (table) => !status.details.tables[table],
        );
        console.log(`❌ Missing tables: ${missingTables.join(", ")}`);
        status.error = `Missing tables: ${missingTables.join(", ")}`;
      }

      return status;
    } catch (error) {
      console.error("❌ Database status check failed:", error);
      status.error = error instanceof Error ? error.message : String(error);
      return status;
    }
  }

  async generateStatusReport(): Promise<string> {
    const status = await this.checkDatabaseStatus();

    let report = `
# 📊 DATABASE STATUS REPORT

**Timestamp:** ${new Date().toLocaleString("pt-BR")}

## 🔌 Connection Status
${status.connected ? "✅ CONNECTED" : "❌ DISCONNECTED"}

## 📋 Tables Status  
${status.tablesExist ? "✅ ALL TABLES EXIST" : "❌ MISSING TABLES"}

`;

    // Table details
    report += `### Table Details:\n`;
    Object.entries(status.details.tables).forEach(([table, exists]) => {
      const count = status.details.recordCounts[table];
      report += `- ${exists ? "✅" : "❌"} **${table}**: ${exists ? `${count} records` : "NOT FOUND"}\n`;
    });

    // Data status
    report += `\n## 📊 Data Status\n`;
    report += `${status.hasData ? "✅ HAS DATA" : "❌ NO DATA"}\n\n`;

    if (status.hasData) {
      const totalRecords = Object.values(status.details.recordCounts).reduce(
        (sum, count) => sum + count,
        0,
      );
      report += `**Total Records:** ${totalRecords}\n\n`;
    }

    // Multi-tenant status
    report += `## 🏢 Multi-Tenant Status\n`;
    report += `${status.multiTenantReady ? "✅ READY" : "❌ NOT READY"}\n\n`;

    if (status.details.businesses.length > 0) {
      report += `### Businesses:\n`;
      status.details.businesses.forEach((business) => {
        report += `- **${business.name}** (${business.business_type || "unknown"})\n`;
        report += `  - ID: \`${business.id}\`\n`;
        report += `  - Status: ${business.subscription_status || "unknown"}\n`;
      });
    }

    // Error details
    if (status.error) {
      report += `\n## ❌ Error Details\n`;
      report += `\`\`\`\n${status.error}\n\`\`\`\n`;
    }

    // Recommendations
    report += `\n## 🎯 Recommendations\n`;

    if (!status.connected) {
      report += `- Check Supabase credentials in .env file\n`;
      report += `- Verify Supabase project is active\n`;
      report += `- Test network connectivity\n`;
    } else if (!status.tablesExist) {
      report += `- Run the URGENT_DATABASE_FIX.sql script in Supabase SQL Editor\n`;
      report += `- Check table creation permissions\n`;
      report += `- Verify schema was applied correctly\n`;
    } else if (!status.hasData) {
      report += `- Insert sample data using the provided scripts\n`;
      report += `- Check if data insertion was successful\n`;
    } else if (!status.multiTenantReady) {
      report += `- Create business records in the businesses table\n`;
      report += `- Verify business_id columns exist in all tables\n`;
    } else {
      report += `- ✅ Database is fully operational!\n`;
      report += `- Consider running the test suite to validate functionality\n`;
    }

    return report;
  }

  // Quick fix suggestions
  async getQuickFixInstructions(): Promise<string[]> {
    const status = await this.checkDatabaseStatus();
    const fixes: string[] = [];

    if (!status.connected) {
      fixes.push("Check your Supabase credentials in the .env file");
      fixes.push("Verify your Supabase project is active and accessible");
    }

    if (!status.tablesExist) {
      fixes.push("Apply the database schema using URGENT_DATABASE_FIX.sql");
      fixes.push("Go to Supabase Dashboard > SQL Editor and run the script");
    }

    if (!status.hasData) {
      fixes.push("The sample data should be inserted automatically");
      fixes.push("If not, check the INSERT statements in the schema file");
    }

    if (!status.multiTenantReady) {
      fixes.push("Ensure businesses table has at least one record");
      fixes.push("Verify all tables have business_id columns");
    }

    if (fixes.length === 0) {
      fixes.push("Database appears to be healthy!");
      fixes.push("Try refreshing the application");
    }

    return fixes;
  }
}

// Utility function for easy usage
export const checkDatabaseQuickly = async () => {
  const checker = new DatabaseStatusChecker();
  const status = await checker.checkDatabaseStatus();

  console.log("📊 QUICK DATABASE CHECK:");
  console.log(`Connection: ${status.connected ? "✅" : "❌"}`);
  console.log(`Tables: ${status.tablesExist ? "✅" : "❌"}`);
  console.log(`Data: ${status.hasData ? "✅" : "❌"}`);
  console.log(`Multi-Tenant: ${status.multiTenantReady ? "✅" : "❌"}`);

  if (status.error) {
    console.error(`Error: ${status.error}`);
  }

  return status;
};
