import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES = {
  "/dashboard": "Overview Dashboard",
  "/traffic": "Traffic Monitor",
  "/alerts": "Alerts & Events",
  "/threats": "Threat Intelligence",
  "/policy": "Policy Manager (SEPM)",
  "/ml-engine": "ML Engine",
  "/reports": "Reports & Analytics",
  "/users": "Users & RBAC",
  "/settings": "System Settings",
};

export default function Layout({ children }) {
  const location = useLocation();
  const currentTitle = PAGE_TITLES[location.pathname] || "CyberSentinel";

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div 
        style={{
          marginLeft: "var(--nav-w)",
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
        className="main" // Applying the existing global main class too just in case
      >
        <Topbar title={currentTitle} />
        <main 
          style={{ padding: "24px 28px 40px", flex: 1 }}
          className="page-area active"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
