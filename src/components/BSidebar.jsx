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
      <aside className="bg-green-800 text-white p-6 lg:fixed lg:h-full lg:w-56 w-full font-mono flex flex-col justify-between">
        <div>
          <img
            src="./images/csu.png"
            alt="csu-logo"
            className="hidden lg:block w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4 object-contain"
          />

          <div className="flex justify-between items-center lg:block">
            <h1 className="hidden lg:block text-2xl font-bold mb-2 lg:mb-10">
              Visitor Management System
            </h1>
            <img
              src="./images/csu.png"
              alt="csu-logo"
              className="block lg:hidden w-1/6 sm:w-1/8 md:w-1/10 object-contain"
            />
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>

          <nav
            className={`flex flex-col lg:flex ${isMenuOpen ? 'block' : 'hidden'} lg:block`}
          >
            <ul className="space-y-2">
              <li className="p-2 hover:bg-green-700 rounded flex items-center">
                <RiDashboardFill className="mr-3" />
                <NavLink to="/notifications" className="block">
                  Dashboard
                </NavLink>
              </li>
              <li className="p-2 hover:bg-green-700 rounded flex items-center">
                <FaCalendarAlt className="mr-3" />
                <NavLink to="/bevents" className="block">
                  Events
                </NavLink>
              </li>
              <li className="p-2 hover:bg-green-700 rounded flex items-center">
                <FaClipboardList className="mr-3" />
                <NavLink to="/breports" className="block">
                  Reports
                </NavLink>
              </li>
              <li className="p-2 hover:bg-green-700 rounded flex items-center">
                <FaBan className="mr-3" />
                <NavLink to="/blocklist" className="block">
                  Blocklist
                </NavLink>
              </li>
              <li className="p-2 hover:bg-green-700 rounded flex items-center">
                <FaDoorOpen className="mr-3" />
                <NavLink to="/bvisitor" className="block">
                  Visitor Log
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="mt-4 lg:mt-auto">
          <h3 className="mb-2">Current User: {role}</h3>
          <button
            onClick={openModal}
            className="mt-auto hidden lg:flex items-center w-full text-sm hover:bg-green-700 rounded p-2 mb-4"
          >
            <RiLogoutBoxRFill className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
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
