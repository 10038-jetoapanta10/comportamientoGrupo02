// App.jsx
import { createClient } from '@supabase/supabase-js';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import '../index.css';
import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router'; // Cambiado

// Configurar el cliente Supabase
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Success = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value.data.user);
          setUser(value.data.user);
        }
      });
    }
    getUserData();
  }, []);

  async function singOutUser() {
    const { error } = await supabase.auth.signOut();
    localStorage.clear();
    navigate("/"); 
  }

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm supabase={supabase} />
      <TaskList supabase={supabase} />
      <button onClick={() => singOutUser()}>Salir</button>
    </div>
  );
};

export default Success;
