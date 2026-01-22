import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Super Admin credentials (hardcoded - the owner)
const SUPER_ADMIN = {
  id: 'super_admin_001',
  username: 'superadmin',
  password: 'SanLorenzo@2024!',
  role: 'super_admin' as const,
  name: 'Super Admin'
};

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'super_admin' | 'worker_admin';
  name: string;
  createdAt: string;
}

interface AdminAuthContextType {
  adminUser: Omit<AdminUser, 'password'> | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  workerAdmins: Omit<AdminUser, 'password'>[];
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
  createWorkerAdmin: (username: string, password: string, name: string) => { success: boolean; message: string };
  deleteWorkerAdmin: (adminId: string) => boolean;
  getWorkerAdmins: () => Omit<AdminUser, 'password'>[];
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<Omit<AdminUser, 'password'> | null>(null);
  const [workerAdmins, setWorkerAdmins] = useState<Omit<AdminUser, 'password'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkerAdmins = () => {
    const saved = localStorage.getItem('workerAdmins');
    if (saved) {
      try {
        const admins = JSON.parse(saved) as AdminUser[];
        setWorkerAdmins(admins.map(({ password, ...rest }) => rest));
      } catch (e) {
        console.error('Error loading worker admins:', e);
      }
    }
  };

  // Load admin session and worker admins on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedAdmin = localStorage.getItem('adminUser');
        if (savedAdmin) {
          const parsed = JSON.parse(savedAdmin);
          setAdminUser(parsed);
        }
        loadWorkerAdmins();
      } catch (e) {
        console.error('Error initializing admin auth:', e);
        localStorage.removeItem('adminUser');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const getWorkerAdmins = (): Omit<AdminUser, 'password'>[] => {
    const saved = localStorage.getItem('workerAdmins');
    if (saved) {
      try {
        const admins = JSON.parse(saved) as AdminUser[];
        return admins.map(({ password, ...rest }) => rest);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const adminLogin = (username: string, password: string): boolean => {
    // Check super admin first
    if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
      const { password: _, ...adminWithoutPassword } = SUPER_ADMIN;
      setAdminUser(adminWithoutPassword);
      localStorage.setItem('adminUser', JSON.stringify(adminWithoutPassword));
      return true;
    }

    // Check worker admins
    const savedWorkerAdmins = localStorage.getItem('workerAdmins');
    if (savedWorkerAdmins) {
      try {
        const admins = JSON.parse(savedWorkerAdmins) as AdminUser[];
        const foundAdmin = admins.find(a => a.username === username && a.password === password);
        if (foundAdmin) {
          const { password: _, ...adminWithoutPassword } = foundAdmin;
          setAdminUser(adminWithoutPassword);
          localStorage.setItem('adminUser', JSON.stringify(adminWithoutPassword));
          return true;
        }
      } catch (e) {
        console.error('Error checking worker admins:', e);
      }
    }

    return false;
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const createWorkerAdmin = (username: string, password: string, name: string): { success: boolean; message: string } => {
    // Only super admin can create worker admins
    if (!adminUser || adminUser.role !== 'super_admin') {
      return { success: false, message: 'Only super admin can create worker admins' };
    }

    // Check if username already exists
    if (username === SUPER_ADMIN.username) {
      return { success: false, message: 'Username already exists' };
    }

    let admins: AdminUser[] = [];
    const savedWorkerAdmins = localStorage.getItem('workerAdmins');
    if (savedWorkerAdmins) {
      try {
        admins = JSON.parse(savedWorkerAdmins);
      } catch (e) {
        admins = [];
      }
    }

    if (admins.some(a => a.username === username)) {
      return { success: false, message: 'Username already exists' };
    }

    // Validate password
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const newAdmin: AdminUser = {
      id: `worker_admin_${Date.now()}`,
      username,
      password,
      role: 'worker_admin',
      name,
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem('workerAdmins', JSON.stringify(admins));
    loadWorkerAdmins();

    return { success: true, message: 'Worker admin created successfully' };
  };

  const deleteWorkerAdmin = (adminId: string): boolean => {
    // Only super admin can delete worker admins
    if (!adminUser || adminUser.role !== 'super_admin') {
      return false;
    }

    const savedWorkerAdmins = localStorage.getItem('workerAdmins');
    if (!savedWorkerAdmins) return false;

    try {
      const admins: AdminUser[] = JSON.parse(savedWorkerAdmins);
      const filteredAdmins = admins.filter(a => a.id !== adminId);

      if (filteredAdmins.length === admins.length) {
        return false; // Admin not found
      }

      localStorage.setItem('workerAdmins', JSON.stringify(filteredAdmins));
      loadWorkerAdmins();
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      isAdminAuthenticated: !!adminUser,
      isLoading,
      isSuperAdmin: adminUser?.role === 'super_admin',
      workerAdmins,
      adminLogin,
      adminLogout,
      createWorkerAdmin,
      deleteWorkerAdmin,
      getWorkerAdmins
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
