import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import VisitorReg from './components/VisitorReg.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Visitors from './components/Visitors.jsx';
import Events from './components/Events.jsx';
import Archives from './components/Archives.jsx';
import Notifications from './components/Notifications.jsx';

import BEvents from './components/BEvents.jsx';
import BReports from './components/BReports.jsx';
import BVisitorLog from './components/BVisitorLog.jsx';
import Security from './components/Security.jsx';
import Blocklist from './components/Blocklist.jsx';
import VisitorForm from './components/VisitorForm.jsx';


function Router() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/registration" element={<VisitorReg />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/visitors" element={<Visitors />} />
      <Route path="/events" element={<Events />} />
      <Route path="/archives" element={<Archives />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/bevents" element={<BEvents />} />
      <Route path="/breports" element={<BReports />} />
      <Route path="/bvisitor" element={<BVisitorLog />} />
      <Route path="/security" element={<Security />} />
      <Route path="/blocklist" element={<Blocklist />} />

      <Route path="/visitorform" element={<VisitorForm />} />
    </Routes>
  );
}

export default Router;
