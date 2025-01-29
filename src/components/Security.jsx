import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { MdAccessTime, MdBlock } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Security = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');
  const [visitorData, setVisitorData] = useState([]);
  const [expectedVisitors, setExpectedVisitors] = useState('');
  const [time_in, setTimeIn] = useState('');
  const [time_out, setTimeOut] = useState('');
  const [blocklistData, setBlocklistData] = useState([]);

  // State to handle the active tab
  const [activeTab, setActiveTab] = useState('security');

  useEffect(() => {
    const fetchSession = async () => {
      if (role === null) {
        alert('Please login first');
        navigate('/login');
      } else {
        fetch_visitors();
        fetchBlocklist();
      }
    };

    fetchSession();
  }, [navigate]);

  const fetch_visitors = async () => {
    try {
      const { data, error } = await supabase.from('block').select('*');

      if (error) throw error;

      const sortedData = data.filter((item) => item.status !== 'Blocked');
      setVisitorData(sortedData);
      const filteredData = data.filter((row) => row.time_in === null);
      setExpectedVisitors(filteredData.length);
      const pending = data.filter((row) => row.status === 'Pending');
      setTimeIn(pending.length);
      const blocked = data.filter((row) => row.status === 'Blocked');
      setTimeOut(blocked.length);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Error during registration:', error.message);
    }
  };

  const fetchBlocklist = async () => {
    try {
      const { data, error } = await supabase
        .from('block')
        .select('*')
        .eq('status', 'Blocked');

      if (error) throw error;

      const sortedData = data.sort(
        (a, b) => new Date(b.time_in) - new Date(a.time_in)
      );
      setBlocklistData(sortedData);
    } catch (error) {
      console.error('Error fetching blocklist data:', error.message);
    }
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

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleAccept = async (visitor) => {
    try {
      const { error } = await supabase
        .from('block')
        .update({ status: 'Blocked' })
        .eq('name', visitor.name);
      if (error) throw error;
      updateBlock(visitor);
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    }
  };

  const updateBlock = async (visitor) => {
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ block: 'Blocked' })
        .eq('name', visitor.name);
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    }
  };

  const handleReject = async (visitor) => {
    try {
      const { error } = await supabase
        .from('block')
        .delete()
        .eq('name', visitor.name);
      if (error) throw error;
      removeBlock(visitor);
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    }
  };

  const removeBlock = async (visitor) => {
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ block: null })
        .eq('name', visitor.name);
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen font-mono relative"
      style={{
        backgroundImage: "url('images/csu-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="w-full lg:w-3/4 bg-gray-200 rounded-lg shadow-lg relative z-10 backdrop-blur-sm bg-white/40 border border-white/40 p-3">
        <div className="flex justify-between p-4">
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-2">
            <button
              className={`rounded-lg py-2 px-4 ${activeTab === 'security' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('security')}
            >
              Sanction
            </button>
            <button
              className={`rounded-lg py-2 px-4 ${activeTab === 'blocklist' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('blocklist')}
            >
              Blocklist
            </button>
          </div>
          <button
            className="flex items-center bg-green-900 text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 rounded shadow"
            onClick={openModal}
          >
            <FaRegUserCircle className="mr-1" />
            {role}
          </button>
        </div>

        <main className="h-[80vh] p-4 lg:p-8 flex flex-col items-center">
          {/* Conditional rendering based on active tab */}
          {activeTab === 'security' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-5 w-full">
                {[
                  {
                    title: 'Total Pending',
                    count: time_in,
                    icon: <MdAccessTime className="w-12 h-12 text-white" />,
                    bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
                  },
                  {
                    title: 'Total Blocked',
                    count: time_out,
                    icon: <MdBlock className="w-12 h-12 text-white" />,
                    bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`${item.bgColor} rounded-lg shadow-xl p-4 text-white text-center hover:shadow-2xl transition-shadow duration-300 ease-in-out`}
                  >
                    <div className="flex justify-center items-center space-x-4 mb-4">
                      {item.icon}
                      <h3 className="text-4xl font-bold">{item.count}</h3>
                    </div>
                    <p className="text-sm mt-2 font-medium">{item.title}</p>
                  </div>
                ))}
              </div>

              <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-7 text-center">
                <div className="overflow-x-auto max-h-60 overflow-y-auto">
                  <table className="w-full table-auto table">
                    <thead>
                      <tr className="border-b">
                        {['Name', 'Reason for blocking', 'Actions'].map(
                          (header, index) => (
                            <th key={index} className="text-center p-2">
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {visitorData.map((visitor, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 text-center">{visitor.name}</td>
                          <td className="p-2 text-center">{visitor.reason}</td>
                          <td className="p-2 text-center">
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                              onClick={() => handleAccept(visitor)}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              onClick={() => handleReject(visitor)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'blocklist' && (
            <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full table table-auto">
                  <thead>
                    <tr className="border-b">
                      <th>Name</th>
                      <th>Reason for blocking</th>
                      <th>Date Blocked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocklistData.map((blocked, index) => (
                      <tr key={index} className="border-b">
                        <td>{blocked.name}</td>
                        <td>{blocked.reason}</td>
                        <td>
                          {new Date(blocked.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <dialog id="error_modal" className="modal">
        <div className="modal-box max-w-md w-full flex flex-col items-center justify-center p-8">
          <form method="dialog" className="w-full">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:bg-gray-200 focus:outline-none"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="font-bold text-2xl text-center text-gray-800">
              Are you sure you want to log out?
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              You will be signed out of your account, and any unsaved progress
              may be lost.
            </p>
            <div className="w-full flex justify-center mt-6 space-x-4">
              <button
                onClick={logout}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-md transition duration-300 transform hover:bg-orange-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Logout
              </button>
              <button
                onClick={closeModal}
                className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-md transition duration-300 transform hover:bg-gray-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Security;
