import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthContextType,
  UserSession,
  SignupData,
  User,
  Establishment,
  ROLE_PERMISSIONS,
  Permission,
} from "@/lib/multiTenantTypes";

interface AuthState {
  session: UserSession | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SESSION"; payload: UserSession | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  session: null,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SESSION":
      return {
        ...state,
        session: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, session: null, isLoading: false, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load session from localStorage on mount
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = () => {
    try {
      const sessionData = localStorage.getItem("unclic-session");
      if (sessionData) {
        const session = JSON.parse(sessionData);
        // Validate session structure
        if (session.user && session.establishment && session.token) {
          dispatch({ type: "SET_SESSION", payload: session });
        } else {
          localStorage.removeItem("unclic-session");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Error loading session:", error);
      localStorage.removeItem("unclic-session");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveSession = (session: UserSession) => {
    localStorage.setItem("unclic-session", JSON.stringify(session));
    dispatch({ type: "SET_SESSION", payload: session });
  };

  const clearSession = () => {
    localStorage.removeItem("unclic-session");
    dispatch({ type: "LOGOUT" });
  };

  // Mock API functions (replace with real API calls)
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const user: User = {
        id: "1",
        name: "Maria Silva",
        email: email,
        phone: "(11) 99999-9999",
        role: "owner",
        establishment_id: "est_1",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const establishment: Establishment = {
        id: "est_1",
        name: "Salão da Maria",
        email: "contato@salaodamaria.com",
        phone: "(11) 3333-4444",
        address: "Rua das Flores, 123 - Centro",
        cep: "01234-567",
        subscription_plan: "premium",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const session: UserSession = {
        user,
        establishment,
        token: "mock-jwt-token",
        permissions: ROLE_PERMISSIONS[user.role],
      };

      saveSession(session);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Credenciais inválidas" });
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user: User = {
        id: "2",
        name: "João Santos",
        email: "joao@gmail.com",
        role: "owner",
        establishment_id: "est_2",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const establishment: Establishment = {
        id: "est_2",
        name: "Barbearia do João",
        email: "contato@barbeariajoo.com",
        phone: "(11) 5555-6666",
        address: "Avenida Principal, 456",
        cep: "12345-678",
        subscription_plan: "basic",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const session: UserSession = {
        user,
        establishment,
        token: "google-jwt-token",
        permissions: ROLE_PERMISSIONS[user.role],
      };

      saveSession(session);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro no login com Google" });
      throw error;
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new establishment and user
      const establishmentId = `est_${Date.now()}`;
      const userId = `user_${Date.now()}`;

      const user: User = {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: "owner",
        establishment_id: establishmentId,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const establishment: Establishment = {
        id: establishmentId,
        name: userData.establishmentName,
        email: userData.email,
        phone: userData.establishmentPhone,
        address: userData.establishmentAddress,
        cep: "",
        subscription_plan: "free",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const session: UserSession = {
        user,
        establishment,
        token: "new-user-jwt-token",
        permissions: ROLE_PERMISSIONS[user.role],
      };

      saveSession(session);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro ao criar conta" });
      throw error;
    }
  };

  const logout = () => {
    clearSession();
  };

  const switchEstablishment = async (
    establishmentId: string,
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API call to switch establishment
      await new Promise((resolve) => setTimeout(resolve, 500));

      // This would fetch the new establishment data
      // For now, just simulate switching
      console.log("Switching to establishment:", establishmentId);

      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Erro ao trocar estabelecimento",
      });
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    session: state.session,
    isLoading: state.isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    switchEstablishment,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper hook for checking permissions
export const usePermissions = () => {
  const { session } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!session) return false;
    return session.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!session) return false;
    return permissions.some((permission) =>
      session.permissions.includes(permission),
    );
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!session) return false;
    return permissions.every((permission) =>
      session.permissions.includes(permission),
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: session?.permissions || [],
  };
};
