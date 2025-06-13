#!/usr/bin/env node

/**
 * Neon PostgreSQL Setup Script
 *
 * Este script ajuda a configurar a connection string do Neon PostgreSQL
 * automaticamente no arquivo .env
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupNeon() {
  console.log("🚀 Configuração do Neon PostgreSQL para Unclic");
  console.log("==========================================\n");

  console.log("📋 Para obter essas informações:");
  console.log("   1. Acesse https://console.neon.tech");
  console.log("   2. Crie ou selecione seu projeto");
  console.log('   3. Vá para "Connection Details"');
  console.log("   4. Copie a connection string\n");

  // Ask for Neon connection details
  const databaseUrl = await askQuestion("🔗 Cole sua Neon connection string: ");

  if (!databaseUrl || !databaseUrl.includes("postgresql://")) {
    console.log(
      '❌ Connection string inválida. Deve começar com "postgresql://"',
    );
    process.exit(1);
  }

  // Update .env file
  const envPath = path.join(__dirname, ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Replace or add DATABASE_URL
  if (envContent.includes("DATABASE_URL=")) {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${databaseUrl}`,
    );
  } else {
    envContent += `\nDATABASE_URL=${databaseUrl}\n`;
  }

  // Write updated .env
  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Configuração do Neon salva no arquivo .env");
  console.log("\n🎯 Próximos passos:");
  console.log("   1. npm run migrate:neon  (criar tabelas)");
  console.log("   2. npm run seed:neon     (popular dados)");
  console.log("   3. npm run dev:neon      (iniciar servidor)");
  console.log("\n🚀 Sua aplicação estará rodando em: http://localhost:3001");
  console.log("📊 Health check: http://localhost:3001/api/health");

  rl.close();
}

// Run setup
setupNeon().catch((error) => {
  console.error("❌ Erro na configuração:", error);
  process.exit(1);
});
