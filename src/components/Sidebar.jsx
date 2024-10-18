import React, { useState } from 'react';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error.message);
      alert('Error during logout. Please try again.');
      setIsLoading(false);
    } else {
      navigate('/login');
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
      <aside className="bg-green-800 text-white p-6 lg:fixed lg:h-full lg:w-64 w-full">
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
            <li className="p-2 hover:bg-green-700 rounded">
              <NavLink to="/dashboard" className="block">
                Dashboard
              </NavLink>
            </li>

            <li className="p-2 hover:bg-green-700 rounded">
              <NavLink to="/visitors" className="block">
                Visitors
              </NavLink>
            </li>

            <li className="p-2 hover:bg-green-700 rounded">
              <NavLink to="/events" className="block">
                Events
              </NavLink>
            </li>

            <li className="p-2 hover:bg-green-700 rounded">
              <NavLink to="/archives" className="block">
                Archives
              </NavLink>
            </li>
          </ul>

          <button className="hidden lg:flex items-center hover:bg-green-700 p-2 rounded mt-10">
            <span className="mr-2">
              <FaUser size={15} />
            </span>
            User Profile
          </button>
          <button
            onClick={() => openModal()}
            className="hidden lg:flex items-center text-sm hover:bg-green-700 rounded p-2"
          >
            <span className="mr-2">
              <RiLogoutBoxRFill size={18} />
            </span>
            Logout
          </button>
        </nav>
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
          <div className="flex justify-end content-end">
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

export default Sidebar;
