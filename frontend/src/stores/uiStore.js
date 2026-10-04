import { create } from 'zustand';

// Check initial theme from system preference or localStorage
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('hc_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useUIStore = create((set, get) => ({
  theme: getInitialTheme(),
  isMobileSidebarOpen: false,
  isSearchModalOpen: false,
  isNotificationDropdownOpen: false,
  unreadNotificationsCount: 2,

  initTheme: () => {
    const currentTheme = get().theme;
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('hc_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  setTheme: (theme) => {
    localStorage.setItem('hc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
  setNotificationDropdownOpen: (isOpen) => set({ isNotificationDropdownOpen: isOpen }),
  setUnreadCount: (count) => set({ unreadNotificationsCount: count }),
  decrementUnreadCount: () => set(state => ({ unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1) }))
}));

export const useUiStore = useUIStore;
export default useUIStore;
