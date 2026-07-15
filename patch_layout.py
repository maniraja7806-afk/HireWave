import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

layout_old = """const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [
      { id: Date.now().toString(), message: msg, read: false, timestamp: new Date() },
      ...prev
    ]);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-0`}>
      <Router>
        <NotificationManager addNotification={addNotification} />
        <Navbar toggleTheme={() => setIsDark(!isDark)} isDark={isDark} notifications={notifications} setNotifications={setNotifications} />
        <PageHeader />
        {children}
        <BottomNav />
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: isDark ? '#1e293b' : '#333', color: '#fff' } }} />
      </Router>
    </div>
  );
};"""

layout_new = """const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const location = useLocation();

  const addNotification = (msg: string) => {
    setNotifications(prev => [
      { id: Date.now().toString(), message: msg, read: false, timestamp: new Date() },
      ...prev
    ]);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors ${isAuthPage ? '' : 'pb-16 md:pb-0'}`}>
      <NotificationManager addNotification={addNotification} />
      <Navbar toggleTheme={() => setIsDark(!isDark)} isDark={isDark} notifications={notifications} setNotifications={setNotifications} />
      <PageHeader />
      {children}
      <BottomNav />
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: isDark ? '#1e293b' : '#333', color: '#fff' } }} />
    </div>
  );
};"""

app_old = """export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}"""

app_new = """export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}"""

content = content.replace(layout_old, layout_new)
content = content.replace(app_old, app_new)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
