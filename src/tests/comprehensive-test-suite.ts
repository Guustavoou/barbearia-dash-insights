import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "../lib/tenantConfig";

export interface TestResult {
  testName: string;
  status: "PASS" | "FAIL" | "SKIP";
  duration: number;
  error?: string;
  details?: any;
  dataValidation?: {
    created: boolean;
    read: boolean;
    updated: boolean;
    deleted: boolean;
  };
}

export interface TestSuiteResult {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
  supabaseConnectionValid: boolean;
  multiTenantIsolationValid: boolean;
}

export class ComprehensiveTestSuite {
  private results: TestResult[] = [];
  private currentBusinessId: string;

  constructor() {
    this.currentBusinessId = getCurrentBusinessId();
  }

  async runAllTests(): Promise<TestSuiteResult> {
    console.log("🚀 Iniciando bateria completa de testes...");
    const startTime = Date.now();

    // Verificar conexão Supabase
    const connectionValid = await this.testSupabaseConnection();

    // Testes de funcionalidades principais
    await this.testDashboardFunctionality();
    await this.testClientsCRUD();
    await this.testAppointmentsCRUD();
    await this.testServicesCRUD();
    await this.testProfessionalsCRUD();
    await this.testProductsCRUD();
    await this.testFinancialOperations();
    await this.testReportsGeneration();

    // Testes multi-tenant
    const multiTenantValid = await this.testMultiTenantIsolation();

    const endTime = Date.now();
    const duration = endTime - startTime;

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const skipped = this.results.filter((r) => r.status === "SKIP").length;

    return {
      totalTests: this.results.length,
      passed,
      failed,
      skipped,
      duration,
      results: this.results,
      supabaseConnectionValid: connectionValid,
      multiTenantIsolationValid: multiTenantValid,
    };
  }

  private async testSupabaseConnection(): Promise<boolean> {
    const result = await this.runTest("Supabase Connection", async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name")
        .limit(1);

      if (error) throw error;
      return { connected: true, businessCount: data?.length || 0 };
    });

    return result.status === "PASS";
  }

  private async testDashboardFunctionality() {
    await this.runTest("Dashboard Data Loading", async () => {
      const promises = [
        supabase
          .from("clients")
          .select("count", { count: "exact" })
          .eq("business_id", this.currentBusinessId),
        supabase
          .from("appointments")
          .select("count", { count: "exact" })
          .eq("business_id", this.currentBusinessId),
        supabase
          .from("services")
          .select("count", { count: "exact" })
          .eq("business_id", this.currentBusinessId),
        supabase
          .from("professionals")
          .select("count", { count: "exact" })
          .eq("business_id", this.currentBusinessId),
      ];

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (result.error) throw result.error;
      });

      return {
        clients: results[0].count,
        appointments: results[1].count,
        services: results[2].count,
        professionals: results[3].count,
      };
    });
  }

  private async testClientsCRUD() {
    const testClient = {
      name: `Cliente Teste ${Date.now()}`,
      email: `teste${Date.now()}@email.com`,
      phone: "11999999999",
      business_id: this.currentBusinessId,
    };

    let clientId: string;

    // Teste CREATE
    await this.runTest("Clients - CREATE", async () => {
      const { data, error } = await supabase
        .from("clients")
        .insert([testClient])
        .select()
        .single();

      if (error) throw error;
      clientId = data.id;
      return { created: true, clientId: data.id };
    });

    // Teste READ
    await this.runTest("Clients - READ", async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("business_id", this.currentBusinessId)
        .single();

      if (error) throw error;
      if (data.name !== testClient.name) throw new Error("Data mismatch");
      return { found: true, data };
    });

    // Teste UPDATE
    await this.runTest("Clients - UPDATE", async () => {
      const updatedName = `${testClient.name} - Atualizado`;
      const { data, error } = await supabase
        .from("clients")
        .update({ name: updatedName })
        .eq("id", clientId)
        .eq("business_id", this.currentBusinessId)
        .select()
        .single();

      if (error) throw error;
      if (data.name !== updatedName) throw new Error("Update failed");
      return { updated: true, newName: data.name };
    });

    // Teste DELETE
    await this.runTest("Clients - DELETE", async () => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)
        .eq("business_id", this.currentBusinessId);

      if (error) throw error;

      // Verificar se foi deletado
      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId);

      if (data && data.length > 0) throw new Error("Client not deleted");
      return { deleted: true };
    });
  }

  private async testAppointmentsCRUD() {
    // Buscar um cliente e profissional existente para o teste
    const { data: clients } = await supabase
      .from("clients")
      .select("id")
      .eq("business_id", this.currentBusinessId)
      .limit(1);

    const { data: professionals } = await supabase
      .from("professionals")
      .select("id")
      .eq("business_id", this.currentBusinessId)
      .limit(1);

    if (!clients?.length || !professionals?.length) {
      this.results.push({
        testName: "Appointments - CRUD",
        status: "SKIP",
        duration: 0,
        error: "No clients or professionals available for testing",
      });
      return;
    }

    const testAppointment = {
      client_id: clients[0].id,
      professional_id: professionals[0].id,
      service_name: "Teste Serviço",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      status: "agendado" as const,
      price: 100,
      business_id: this.currentBusinessId,
    };

    let appointmentId: string;

    await this.runTest("Appointments - CRUD Operations", async () => {
      // CREATE
      const { data: created, error: createError } = await supabase
        .from("appointments")
        .insert([testAppointment])
        .select()
        .single();

      if (createError) throw createError;
      appointmentId = created.id;

      // READ
      const { data: read, error: readError } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", appointmentId)
        .eq("business_id", this.currentBusinessId)
        .single();

      if (readError) throw readError;

      // UPDATE
      const { data: updated, error: updateError } = await supabase
        .from("appointments")
        .update({ status: "confirmado" })
        .eq("id", appointmentId)
        .eq("business_id", this.currentBusinessId)
        .select()
        .single();

      if (updateError) throw updateError;

      // DELETE
      const { error: deleteError } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId)
        .eq("business_id", this.currentBusinessId);

      if (deleteError) throw deleteError;

      return {
        created: true,
        read: true,
        updated: true,
        deleted: true,
        appointmentId,
      };
    });
  }

  private async testServicesCRUD() {
    const testService = {
      name: `Serviço Teste ${Date.now()}`,
      description: "Descrição do serviço de teste",
      price: 50,
      duration: 60,
      business_id: this.currentBusinessId,
    };

    let serviceId: string;

    await this.runTest("Services - CRUD Operations", async () => {
      // CREATE
      const { data: created, error: createError } = await supabase
        .from("services")
        .insert([testService])
        .select()
        .single();

      if (createError) throw createError;
      serviceId = created.id;

      // READ
      const { data: read, error: readError } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .eq("business_id", this.currentBusinessId)
        .single();

      if (readError) throw readError;

      // UPDATE
      const { data: updated, error: updateError } = await supabase
        .from("services")
        .update({ price: 75 })
        .eq("id", serviceId)
        .eq("business_id", this.currentBusinessId)
        .select()
        .single();

      if (updateError) throw updateError;

      // DELETE
      const { error: deleteError } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId)
        .eq("business_id", this.currentBusinessId);

      if (deleteError) throw deleteError;

      return {
        created: true,
        read: true,
        updated: true,
        deleted: true,
        serviceId,
      };
    });
  }

  private async testProfessionalsCRUD() {
    const testProfessional = {
      name: `Profissional Teste ${Date.now()}`,
      email: `prof${Date.now()}@email.com`,
      phone: "11888888888",
      specialty: "Teste",
      business_id: this.currentBusinessId,
    };

    let professionalId: string;

    await this.runTest("Professionals - CRUD Operations", async () => {
      // CREATE
      const { data: created, error: createError } = await supabase
        .from("professionals")
        .insert([testProfessional])
        .select()
        .single();

      if (createError) throw createError;
      professionalId = created.id;

      // READ
      const { data: read, error: readError } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", professionalId)
        .eq("business_id", this.currentBusinessId)
        .single();

      if (readError) throw readError;

      // UPDATE
      const { data: updated, error: updateError } = await supabase
        .from("professionals")
        .update({ specialty: "Especialidade Atualizada" })
        .eq("id", professionalId)
        .eq("business_id", this.currentBusinessId)
        .select()
        .single();

      if (updateError) throw updateError;

      // DELETE
      const { error: deleteError } = await supabase
        .from("professionals")
        .delete()
        .eq("id", professionalId)
        .eq("business_id", this.currentBusinessId);

      if (deleteError) throw deleteError;

      return {
        created: true,
        read: true,
        updated: true,
        deleted: true,
        professionalId,
      };
    });
  }

  private async testProductsCRUD() {
    const testProduct = {
      name: `Produto Teste ${Date.now()}`,
      description: "Descrição do produto de teste",
      price: 25.5,
      cost_price: 15.0,
      stock_quantity: 100,
      category: "Teste",
      business_id: this.currentBusinessId,
    };

    let productId: string;

    await this.runTest("Products - CRUD Operations", async () => {
      // CREATE
      const { data: created, error: createError } = await supabase
        .from("products")
        .insert([testProduct])
        .select()
        .single();

      if (createError) throw createError;
      productId = created.id;

      // READ
      const { data: read, error: readError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("business_id", this.currentBusinessId)
        .single();

      if (readError) throw readError;

      // UPDATE
      const { data: updated, error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: 150 })
        .eq("id", productId)
        .eq("business_id", this.currentBusinessId)
        .select()
        .single();

      if (updateError) throw updateError;

      // DELETE
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("business_id", this.currentBusinessId);

      if (deleteError) throw deleteError;

      return {
        created: true,
        read: true,
        updated: true,
        deleted: true,
        productId,
      };
    });
  }

  private async testFinancialOperations() {
    await this.runTest("Financial Operations - Transactions", async () => {
      // Buscar algumas transações existentes
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("business_id", this.currentBusinessId)
        .limit(5);

      if (error) throw error;

      // Calcular total
      const total =
        transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      return {
        transactionCount: transactions?.length || 0,
        totalAmount: total,
        hasTransactions: (transactions?.length || 0) > 0,
      };
    });
  }

  private async testReportsGeneration() {
    await this.runTest("Reports Generation", async () => {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      );

      // Relatório de agendamentos do mês
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("business_id", this.currentBusinessId)
        .gte("date", firstDayOfMonth.toISOString().split("T")[0])
        .lte("date", lastDayOfMonth.toISOString().split("T")[0]);

      if (appointmentsError) throw appointmentsError;

      // Relatório financeiro
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("business_id", this.currentBusinessId)
        .gte("date", firstDayOfMonth.toISOString().split("T")[0])
        .lte("date", lastDayOfMonth.toISOString().split("T")[0]);

      if (transactionsError) throw transactionsError;

      return {
        monthlyAppointments: appointments?.length || 0,
        monthlyTransactions: transactions?.length || 0,
        monthlyRevenue:
          transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
      };
    });
  }

  private async testMultiTenantIsolation(): Promise<boolean> {
    const result = await this.runTest(
      "Multi-Tenant Data Isolation",
      async () => {
        // Buscar todos os negócios
        const { data: businesses, error: businessError } = await supabase
          .from("businesses")
          .select("id, name");

        if (businessError) throw businessError;

        if (!businesses || businesses.length < 2) {
          throw new Error(
            "Pelo menos 2 negócios são necessários para testar isolamento",
          );
        }

        const results: any = {};

        // Para cada negócio, verificar se os dados estão isolados
        for (const business of businesses) {
          const businessData = await Promise.all([
            supabase
              .from("clients")
              .select("count", { count: "exact" })
              .eq("business_id", business.id),
            supabase
              .from("appointments")
              .select("count", { count: "exact" })
              .eq("business_id", business.id),
            supabase
              .from("services")
              .select("count", { count: "exact" })
              .eq("business_id", business.id),
            supabase
              .from("professionals")
              .select("count", { count: "exact" })
              .eq("business_id", business.id),
            supabase
              .from("products")
              .select("count", { count: "exact" })
              .eq("business_id", business.id),
          ]);

          results[business.id] = {
            name: business.name,
            clients: businessData[0].count,
            appointments: businessData[1].count,
            services: businessData[2].count,
            professionals: businessData[3].count,
            products: businessData[4].count,
          };
        }

        // Verificar se não há vazamento de dados entre negócios
        const totalDataCheck = await Promise.all([
          supabase.from("clients").select("business_id"),
          supabase.from("appointments").select("business_id"),
          supabase.from("services").select("business_id"),
          supabase.from("professionals").select("business_id"),
          supabase.from("products").select("business_id"),
        ]);

        const allBusinessIds = businesses.map((b) => b.id);
        let isolationValid = true;

        totalDataCheck.forEach(({ data }) => {
          data?.forEach((record) => {
            if (!allBusinessIds.includes(record.business_id)) {
              isolationValid = false;
            }
          });
        });

        return {
          isolationValid,
          businessData: results,
          totalBusinesses: businesses.length,
        };
      },
    );

    return result.status === "PASS" && result.details?.isolationValid;
  }

  private async runTest(
    testName: string,
    testFunction: () => Promise<any>,
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      console.log(`🧪 Executando: ${testName}`);
      const details = await testFunction();
      const duration = Date.now() - startTime;

      const result: TestResult = {
        testName,
        status: "PASS",
        duration,
        details,
      };

      this.results.push(result);
      console.log(`✅ ${testName} - PASSOU (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        testName,
        status: "FAIL",
        duration,
        error: error instanceof Error ? error.message : String(error),
      };

      this.results.push(result);
      console.log(`❌ ${testName} - FALHOU (${duration}ms): ${result.error}`);
      return result;
    }
  }
}
