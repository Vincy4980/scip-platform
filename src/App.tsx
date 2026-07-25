import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import Layout from './components/Layout';
import PermissionGate from './components/PermissionGate';
import { Modules } from './types/user';
import Forbidden from './pages/Forbidden';
import Dashboard from './pages/Dashboard';
import Procurement from './pages/Procurement';
import Inventory from './pages/Inventory';
import Logistics from './pages/Logistics';
import AIAssistant from './pages/AIAssistant';
import Orders from './pages/Orders';
import Warehouse from './pages/Warehouse';
import Delivery from './pages/Delivery';
import ControlTower from './pages/ControlTower';
import Sourcing from './pages/Sourcing';
import Customs from './pages/Customs';
import Finance from './pages/Finance';
import Sustainability from './pages/Sustainability';
import Risk from './pages/Risk';
import Users from './pages/Users';
import MyWorkspace from './pages/MyWorkspace';
import ProcessFlow from './pages/ProcessFlow';
import MarketplaceLayout from './marketplace/components/MarketplaceLayout';
import MarketplaceHome from './marketplace/pages/Home';
import MarketplaceProducts from './marketplace/pages/Products';
import MarketplaceProductDetail from './marketplace/pages/ProductDetail';
import MarketplaceInquiry from './marketplace/pages/Inquiry';
import MarketplaceOrders, {
  MarketplaceOrderDetail,
} from './marketplace/pages/Orders';
import MarketplaceTracking from './marketplace/pages/Tracking';
import MarketplaceAccount from './marketplace/pages/Account';
import MarketplaceAuth from './marketplace/pages/Auth';
import MarketNewsPage, {
  EventDetailPage,
  MarketNewsDetailPage,
} from './marketplace/pages/MarketNews';

function Guard({ module, children }: { module: string; children: ReactNode }) {
  return (
    <PermissionGate module={module} action="view" fallback={<Forbidden />}>
      {children}
    </PermissionGate>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SCIP Marketplace — 下游客户门户（独立布局 / 橙白主题） */}
        <Route path="/marketplace" element={<MarketplaceLayout />}>
          <Route index element={<MarketplaceHome />} />
          <Route path="products" element={<MarketplaceProducts />} />
          <Route path="products/:id" element={<MarketplaceProductDetail />} />
          <Route path="inquiry" element={<MarketplaceInquiry />} />
          <Route path="orders" element={<MarketplaceOrders />} />
          <Route path="orders/:orderId" element={<MarketplaceOrderDetail />} />
          <Route path="tracking/:orderId" element={<MarketplaceTracking />} />
          <Route path="account" element={<MarketplaceAccount />} />
          <Route path="auth" element={<MarketplaceAuth />} />
          <Route path="auth/register" element={<MarketplaceAuth />} />
          <Route path="market-news" element={<MarketNewsPage />} />
          <Route path="market-news/:id" element={<MarketNewsDetailPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Guard module={Modules.DASHBOARD}>
                <Dashboard />
              </Guard>
            }
          />
          <Route
            path="my-workspace"
            element={
              <Guard module={Modules.WORKSPACE}>
                <MyWorkspace />
              </Guard>
            }
          />
          <Route
            path="control-tower"
            element={
              <Guard module={Modules.CONTROL_TOWER}>
                <ControlTower />
              </Guard>
            }
          />
          <Route
            path="sourcing"
            element={
              <Guard module={Modules.SOURCING}>
                <Sourcing />
              </Guard>
            }
          />
          <Route
            path="procurement"
            element={
              <Guard module={Modules.PROCUREMENT}>
                <Procurement />
              </Guard>
            }
          />
          <Route
            path="orders"
            element={
              <Guard module={Modules.ORDERS}>
                <Orders />
              </Guard>
            }
          />
          <Route
            path="process-flow"
            element={
              <Guard module={Modules.PROCESS_FLOW}>
                <ProcessFlow />
              </Guard>
            }
          />
          <Route
            path="inventory"
            element={
              <Guard module={Modules.INVENTORY}>
                <Inventory />
              </Guard>
            }
          />
          <Route
            path="warehouse"
            element={
              <Guard module={Modules.WAREHOUSE}>
                <Warehouse />
              </Guard>
            }
          />
          <Route
            path="logistics"
            element={
              <Guard module={Modules.LOGISTICS}>
                <Logistics />
              </Guard>
            }
          />
          <Route
            path="customs"
            element={
              <Guard module={Modules.CUSTOMS}>
                <Customs />
              </Guard>
            }
          />
          <Route
            path="delivery"
            element={
              <Guard module={Modules.DELIVERY}>
                <Delivery />
              </Guard>
            }
          />
          <Route
            path="finance"
            element={
              <Guard module={Modules.FINANCE}>
                <Finance />
              </Guard>
            }
          />
          <Route
            path="sustainability"
            element={
              <Guard module={Modules.SUSTAINABILITY}>
                <Sustainability />
              </Guard>
            }
          />
          <Route
            path="risk"
            element={
              <Guard module={Modules.RISK}>
                <Risk />
              </Guard>
            }
          />
          <Route
            path="ai"
            element={
              <Guard module={Modules.AI}>
                <AIAssistant />
              </Guard>
            }
          />
          <Route
            path="users"
            element={
              <Guard module={Modules.USERS}>
                <Users />
              </Guard>
            }
          />
          <Route path="forbidden" element={<Forbidden />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
