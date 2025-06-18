
import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 [Auth Test] Testing Supabase connection...');
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('clients')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ [Auth Test] Health check failed:', healthError);
      return {
        success: false,
        error: 'Health check failed',
        details: healthError
      };
    }

    console.log('✅ [Auth Test] Basic connection successful');

    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ [Auth Test] Auth check failed:', authError);
      return {
        success: false,
        error: 'Authentication failed',
        details: authError
      };
    }

    console.log('✅ [Auth Test] Authentication check successful');
    console.log('👤 [Auth Test] Current user:', user ? user.email : 'Not logged in');

    return {
      success: true,
      user: user,
      connectionStatus: 'Connected'
    };

  } catch (error) {
    console.error('❌ [Auth Test] Unexpected error:', error);
    return {
      success: false,
      error: 'Unexpected error occurred',
      details: error
    };
  }
};

export const testDatabaseAccess = async () => {
  try {
    console.log('🔍 [Auth Test] Testing database access...');
    
    // Test reading from tables
    const tables = ['clients', 'services', 'professionals', 'appointments'];
    const results: Record<string, any> = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table as any)
          .select('*')
          .limit(1);

        if (error) {
          results[table] = { success: false, error: error.message };
        } else {
          results[table] = { success: true, rowCount: data?.length || 0 };
        }
      } catch (tableError) {
        results[table] = { success: false, error: 'Table access failed' };
      }
    }

    console.log('📊 [Auth Test] Database access results:', results);
    return results;

  } catch (error) {
    console.error('❌ [Auth Test] Database test failed:', error);
    return {
      success: false,
      error: 'Database test failed',
      details: error
    };
  }
};
