import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const { user, session } = await supabase.auth.session();
        if (user || session) {
          navigate('/success');
        } else {
          navigate('/');
        }
      } catch (error) {
        // Manejar errores de autenticación
        console.error('Error al verificar el estado de autenticación:', error);
        setLoading(false);
      }
    };

    checkAuthState();

    // Realizar la suscripción solo si el componente está montado
    if (unsubscribe === null) {
      const newUnsubscribe = supabase.auth.onAuthStateChange((event) => {
        if (event === 'ERROR') {
          // Manejar errores de autenticación
          console.error('Error en el cambio de estado de autenticación.');
          setLoading(false);
        }
      });

      setUnsubscribe(() => newUnsubscribe);
    }

    // Limpiar la suscripción al desmontar el componente
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          // Mostrar un mensaje de carga o indicador
          <p>Cargando...</p>
        ) : (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: {
                primaryColor: '#3498db',
                secondaryColor: '#2c3e50',
              },
            }}
            theme="dark"
            providers={['discord']}
          />
        )}
      </header>
    </div>
  );
};

export default Login;
