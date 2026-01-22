import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: string;
  oderId: string;
  date: string;
  time: string;
  barber: string;
  service: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  appointments: Appointment[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  deleteAccount: () => void;
addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'oderId'>) => void;
  cancelAppointment: (id: string) => void;
  // Admin functions
  getAllUsers: () => User[];
  getAllAppointments: () => (Appointment & { user: User })[];
  deleteAppointmentAdmin: (appointmentId: string, oderId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedAppointments = localStorage.getItem('appointments');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, validate with backend
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Load user's appointments
      const userAppointments = JSON.parse(localStorage.getItem(`appointments_${foundUser.id}`) || '[]');
      setAppointments(userAppointments);
      localStorage.setItem('appointments', JSON.stringify(userAppointments));
      
      return true;
    }
    return false;
  };

  const signup = async (firstName: string, lastName: string, email: string, phone: string, password: string): Promise<boolean> => {
    // Simulate API call
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user exists
    if (savedUsers.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      password // In real app, hash this!
    };

    savedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(savedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setAppointments([]);
    localStorage.setItem('appointments', JSON.stringify([]));

    return true;
  };

  const logout = () => {
    setUser(null);
    setAppointments([]);
    localStorage.removeItem('user');
    localStorage.removeItem('appointments');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update in users array too
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { ...savedUsers[userIndex], ...data };
      localStorage.setItem('users', JSON.stringify(savedUsers));
    }
  };

  const deleteAccount = () => {
    if (!user) return;

    // Remove user from users array
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = savedUsers.filter((u: any) => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    // Remove user's appointments
    localStorage.removeItem(`appointments_${user.id}`);

    logout();
  };

const addAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'oderId'>) => {
    if (!user) return;

    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
      oderId: user.id,
      status: 'upcoming'
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
  };

  const cancelAppointment = (id: string) => {
    if (!user) return;

    const updatedAppointments = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
  };

  // Admin functions
  const getAllUsers = (): User[] => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return savedUsers.map((u: any) => {
      const { password: _, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  };

  const getAllAppointments = (): (Appointment & { user: User })[] => {
    const allUsers = getAllUsers();
    const allAppointments: (Appointment & { user: User })[] = [];

    allUsers.forEach((u: User) => {
      const userAppointments = JSON.parse(localStorage.getItem(`appointments_${u.id}`) || '[]');
      userAppointments.forEach((apt: Appointment) => {
        allAppointments.push({
          ...apt,
          user: u
        });
      });
    });

    // Sort by date and time (newest first)
    return allAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const deleteAppointmentAdmin = (appointmentId: string, oderId: string) => {
    // Get user's appointments
    const userAppointments = JSON.parse(localStorage.getItem(`appointments_${oderId}`) || '[]');
    
    // Filter out the deleted appointment
    const updatedAppointments = userAppointments.filter((apt: Appointment) => apt.id !== appointmentId);
    
    // Save back
    localStorage.setItem(`appointments_${oderId}`, JSON.stringify(updatedAppointments));

    // If current user is viewing their own appointments, update state
    if (user && user.id === oderId) {
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      appointments,
      login,
      signup,
      logout,
      updateUser,
      deleteAccount,
      addAppointment,
      cancelAppointment,
      getAllUsers,
      getAllAppointments,
      deleteAppointmentAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
