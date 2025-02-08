import React, { useState } from 'react';
import {
  RiLogoutCircleRLine,
  RiLogoutBoxRFill,
  RiDashboardFill,
} from 'react-icons/ri';
import {
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaBan,
  FaDoorOpen,
} from 'react-icons/fa';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const BSidebar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = sessionStorage.getItem('role');

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error.message);
      alert('Error during logout. Please try again.');
      setIsLoading(false);
    } else {
      navigate('/');
    }
    setIsLoading(false);
  };

  const openModal = () => {
    const modal = document.getElementById('error_modal');
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('error_modal');
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      {/* Mobile Header with Logo, Title & Menu Button */}
      <header className="bg-green-800 text-white p-4 flex justify-between items-center lg:hidden">
        <div className="flex items-center space-x-3">
          <img src="./images/csu.png" alt="csu-logo" className="w-10 h-10" />
          <h1 className="text-md font-bold">Visitor Management System</h1>
        </div>
        <button
          className="text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-green-800 text-white p-6 w-56 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Sidebar Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <img src="./images/csu.png" alt="csu-logo" className="w-20 mb-2" />
          <h1 className="text-lg font-bold text-center">Visitor Management System</h1>
        </div>

        {/* Current User (Visible in Mobile and Desktop Sidebar) */}
        <div className="text-center mb-4">
          <h3 className="text-sm font-bold">Current User: {role}</h3>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col font-bold space-y-2">
          <NavLink to="/notifications" className="flex items-center space-x-3 p-3 hover:bg-green-700 rounded">
            <RiDashboardFill size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/bevents" className="flex items-center space-x-3 p-3 hover:bg-green-700 rounded">
            <FaCalendarAlt size={22} />
            <span>Events</span>
          </NavLink>

          <NavLink to="/breports" className="flex items-center space-x-3 p-3 hover:bg-green-700 rounded">
            <FaClipboardList size={22} />
            <span>Reports</span>
          </NavLink>

          <NavLink to="/blocklist" className="flex items-center space-x-3 p-3 hover:bg-green-700 rounded">
            <FaBan size={22} />
            <span>Blocklist</span>
          </NavLink>

          <NavLink to="/bvisitor" className="flex items-center space-x-3 p-3 hover:bg-green-700 rounded">
            <FaDoorOpen size={22} />
            <span>Visitor Log</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <button
          onClick={openModal}
          className="mt-auto flex items-center space-x-3 p-3 hover:bg-green-700 rounded w-full"
          aria-label="Logout"
        >
          <RiLogoutBoxRFill size={22} />
          <span className="font-bold">Logout</span>
        </button>
      </aside>

      {/* Overlay to close sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
              aria-label="Close Modal"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Confirm Action</h3>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="btn btn-error text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <RiLogoutCircleRLine />
                  Log Out
                </>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default BSidebar;
