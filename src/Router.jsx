import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import VisitorReg from './components/VisitorReg.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Visitors from './components/Visitors.jsx';
import Events from './components/Events.jsx';
import Archives from './components/Archives.jsx';
import Notifications from './components/Notifications.jsx';


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
    </Routes>
  );
}

export default Router;
