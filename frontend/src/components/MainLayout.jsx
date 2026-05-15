import Sidebar from "./sidebar";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 antialiased">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white/90 px-6 py-4 text-center text-xs text-slate-500">
          <span className="font-semibold text-slate-700">ClassHub</span>
          {" · "}
          Online Class Management System
          {" · "}
          {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
