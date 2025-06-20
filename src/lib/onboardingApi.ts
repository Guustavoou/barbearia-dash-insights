import { OnboardingData } from "./onboardingTypes";

const API_BASE_URL = "http://localhost:3001/api";

export class OnboardingAPI {
  private static async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error);
      console.warn("Falling back to mock response");

      // Fallback to mock response when backend is not available
      return this.getMockResponse(endpoint, options);
    }
  }

  private static getMockResponse(
    endpoint: string,
    options: RequestInit = {},
  ): any {
    console.log(`Mock response for ${endpoint}`, options);

    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Mock response - backend not available",
          data: {
            id: Date.now().toString(),
            mockData: true,
          },
        });
      }, 500);
    });
  }

  static async createBusiness(businessInfo: any) {
    return this.makeRequest("/onboarding/business", {
      method: "POST",
      body: JSON.stringify(businessInfo),
    });
  }

  static async createServices(businessId: string, services: any[]) {
    return this.makeRequest("/onboarding/services", {
      method: "POST",
      body: JSON.stringify({ businessId, services }),
    });
  }

  static async createProfessionals(businessId: string, professionals: any[]) {
    return this.makeRequest("/onboarding/professionals", {
      method: "POST",
      body: JSON.stringify({ businessId, professionals }),
    });
  }

  static async createWorkingHours(businessId: string, workingHours: any[]) {
    return this.makeRequest("/onboarding/working-hours", {
      method: "POST",
      body: JSON.stringify({ businessId, workingHours }),
    });
  }

  static async completeOnboarding(data: OnboardingData) {
    try {
      return await this.makeRequest("/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({
          businessInfo: data.businessInfo,
          services: data.services,
          professionals: data.professionals,
          workingHours: data.workingHours,
        }),
      });
    } catch (error) {
      console.warn("Backend not available, using mock completion");

      // Mock successful completion
      return {
        success: true,
        message: "Onboarding completed successfully (mock)",
        data: {
          business: { id: "mock-business-1", ...data.businessInfo },
          services: data.services.map((s, i) => ({
            id: `mock-service-${i}`,
            ...s,
          })),
          professionals: data.professionals.map((p, i) => ({
            id: `mock-prof-${i}`,
            ...p,
          })),
          workingHours: data.workingHours.map((h, i) => ({
            id: `mock-hours-${i}`,
            ...h,
          })),
        },
      };
    }
  }

  static async getOnboardingStatus() {
    return this.makeRequest("/onboarding/status");
  }

  // Mock authentication methods (to be replaced with real auth service)
  static async login(email: string, password: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (email && password) {
      return {
        success: true,
        user: {
          id: "1",
          email,
          name: "Maria Silva",
          avatar: null,
        },
        token: "mock-jwt-token",
      };
    }

    throw new Error("Credenciais inválidas");
  }

  static async loginWithGoogle() {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      user: {
        id: "2",
        email: "maria@gmail.com",
        name: "Maria Silva",
        avatar: null,
      },
      token: "google-jwt-token",
    };
  }

  static async createAccount(email: string, password: string) {
    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      user: {
        id: "3",
        email,
        name: email.split("@")[0],
        avatar: null,
      },
      token: "new-user-jwt-token",
    };
  }

  static async logout() {
    // Simulate logout
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  // Upload file helper
  static async uploadFile(file: File, type: "logo" | "banner" | "photo") {
    // Mock file upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, this would upload to your storage service
    // For now, we'll return a mock URL
    const mockUrl = URL.createObjectURL(file);

    return {
      success: true,
      url: mockUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
  }
}
