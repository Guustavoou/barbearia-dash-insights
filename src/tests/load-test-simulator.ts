import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "../lib/tenantConfig";

export interface LoadTestConfig {
  concurrentUsers: number;
  operationsPerUser: number;
  testDurationMs: number;
  operationTypes: ("read" | "create" | "update" | "delete")[];
}

export interface LoadTestResult {
  config: LoadTestConfig;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  operationsPerSecond: number;
  errorRate: number;
  duration: number;
  errors: string[];
  performanceByOperation: {
    [key: string]: {
      count: number;
      avgTime: number;
      successRate: number;
    };
  };
}

export class LoadTestSimulator {
  private businessId: string;
  private results: any[] = [];
  private errors: string[] = [];

  constructor() {
    this.businessId = getCurrentBusinessId();
  }

  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    console.log("🔥 Iniciando teste de carga...", config);

    const startTime = Date.now();
    this.results = [];
    this.errors = [];

    // Criar promessas para usuários simultâneos
    const userPromises = Array.from(
      { length: config.concurrentUsers },
      (_, userIndex) => this.simulateUser(userIndex, config),
    );

    // Executar todos os usuários simultaneamente
    await Promise.allSettled(userPromises);

    const endTime = Date.now();
    const duration = endTime - startTime;

    return this.generateLoadTestReport(config, duration);
  }

  private async simulateUser(
    userIndex: number,
    config: LoadTestConfig,
  ): Promise<void> {
    const userStartTime = Date.now();

    for (let i = 0; i < config.operationsPerUser; i++) {
      // Verificar se deve parar por tempo limite
      if (Date.now() - userStartTime > config.testDurationMs) {
        break;
      }

      // Escolher operação aleatória
      const operationType =
        config.operationTypes[
          Math.floor(Math.random() * config.operationTypes.length)
        ];

      await this.executeOperation(operationType, userIndex, i);

      // Pequena pausa para simular comportamento real
      await this.sleep(Math.random() * 100);
    }
  }

  private async executeOperation(
    operationType: string,
    userIndex: number,
    operationIndex: number,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      let result;

      switch (operationType) {
        case "read":
          result = await this.performReadOperation();
          break;
        case "create":
          result = await this.performCreateOperation(userIndex, operationIndex);
          break;
        case "update":
          result = await this.performUpdateOperation();
          break;
        case "delete":
          result = await this.performDeleteOperation();
          break;
        default:
          throw new Error(`Operação desconhecida: ${operationType}`);
      }

      const duration = Date.now() - startTime;

      this.results.push({
        operation: operationType,
        user: userIndex,
        operationIndex,
        duration,
        success: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.results.push({
        operation: operationType,
        user: userIndex,
        operationIndex,
        duration,
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });

      this.errors.push(`[User ${userIndex}] ${operationType}: ${errorMessage}`);
    }
  }

  private async performReadOperation(): Promise<any> {
    // Alternar entre diferentes tipos de leitura
    const readTypes = [
      "clients",
      "appointments",
      "services",
      "professionals",
      "products",
    ];
    const table = readTypes[Math.floor(Math.random() * readTypes.length)];

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("business_id", this.businessId)
      .limit(10);

    if (error) throw error;
    return data;
  }

  private async performCreateOperation(
    userIndex: number,
    operationIndex: number,
  ): Promise<any> {
    // Criar um cliente de teste
    const testClient = {
      name: `Cliente Load Test U${userIndex}O${operationIndex} ${Date.now()}`,
      email: `loadtest.u${userIndex}.o${operationIndex}.${Date.now()}@test.com`,
      phone: `119${String(userIndex).padStart(2, "0")}${String(operationIndex).padStart(5, "0")}`,
      business_id: this.businessId,
    };

    const { data, error } = await supabase
      .from("clients")
      .insert([testClient])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async performUpdateOperation(): Promise<any> {
    // Buscar um cliente existente e atualizar
    const { data: clients, error: selectError } = await supabase
      .from("clients")
      .select("id")
      .eq("business_id", this.businessId)
      .limit(1);

    if (selectError) throw selectError;
    if (!clients || clients.length === 0) {
      // Se não há clientes, criar um primeiro
      return await this.performCreateOperation(0, 0);
    }

    const { data, error } = await supabase
      .from("clients")
      .update({
        name: `Cliente Atualizado ${Date.now()}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clients[0].id)
      .eq("business_id", this.businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async performDeleteOperation(): Promise<any> {
    // Buscar clientes de teste para deletar
    const { data: clients, error: selectError } = await supabase
      .from("clients")
      .select("id")
      .eq("business_id", this.businessId)
      .ilike("name", "%Load Test%")
      .limit(1);

    if (selectError) throw selectError;
    if (!clients || clients.length === 0) {
      // Se não há clientes de teste, criar um e depois deletar
      const created = await this.performCreateOperation(999, 999);

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", created.id)
        .eq("business_id", this.businessId);

      if (error) throw error;
      return { deleted: created.id };
    }

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clients[0].id)
      .eq("business_id", this.businessId);

    if (error) throw error;
    return { deleted: clients[0].id };
  }

  private generateLoadTestReport(
    config: LoadTestConfig,
    duration: number,
  ): LoadTestResult {
    const totalOperations = this.results.length;
    const successfulOperations = this.results.filter((r) => r.success).length;
    const failedOperations = totalOperations - successfulOperations;

    const responseTimes = this.results.map((r) => r.duration);
    const averageResponseTime =
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
    const minResponseTime = Math.min(...responseTimes) || 0;
    const maxResponseTime = Math.max(...responseTimes) || 0;

    const operationsPerSecond = totalOperations / (duration / 1000);
    const errorRate = (failedOperations / totalOperations) * 100 || 0;

    // Performance por tipo de operação
    const performanceByOperation: {
      [key: string]: { count: number; avgTime: number; successRate: number };
    } = {};

    config.operationTypes.forEach((opType) => {
      const opResults = this.results.filter((r) => r.operation === opType);
      const successfulOps = opResults.filter((r) => r.success);

      if (opResults.length > 0) {
        performanceByOperation[opType] = {
          count: opResults.length,
          avgTime:
            opResults.reduce((sum, r) => sum + r.duration, 0) /
            opResults.length,
          successRate: (successfulOps.length / opResults.length) * 100,
        };
      }
    });

    return {
      config,
      totalOperations,
      successfulOperations,
      failedOperations,
      averageResponseTime,
      minResponseTime,
      maxResponseTime,
      operationsPerSecond,
      errorRate,
      duration,
      errors: this.errors,
      performanceByOperation,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Predefined test scenarios
  static getLightLoadConfig(): LoadTestConfig {
    return {
      concurrentUsers: 5,
      operationsPerUser: 10,
      testDurationMs: 30000, // 30 segundos
      operationTypes: ["read", "create"],
    };
  }

  static getMediumLoadConfig(): LoadTestConfig {
    return {
      concurrentUsers: 15,
      operationsPerUser: 20,
      testDurationMs: 60000, // 1 minuto
      operationTypes: ["read", "create", "update"],
    };
  }

  static getHeavyLoadConfig(): LoadTestConfig {
    return {
      concurrentUsers: 30,
      operationsPerUser: 50,
      testDurationMs: 120000, // 2 minutos
      operationTypes: ["read", "create", "update", "delete"],
    };
  }

  static getRealisticLoadConfig(): LoadTestConfig {
    return {
      concurrentUsers: 10,
      operationsPerUser: 25,
      testDurationMs: 90000, // 1.5 minutos
      operationTypes: ["read", "read", "read", "create", "update"], // Mais leituras, como uso real
    };
  }
}
