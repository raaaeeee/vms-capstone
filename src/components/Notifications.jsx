import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { IoIosPeople } from 'react-icons/io';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaRegUserCircle } from "react-icons/fa";

const Notifications = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const [visitorData, setVisitorData] = useState([]);
  const [expectedVisitors, setExpectedVisitors] = useState('');
  const [time_in, setTimeIn] = useState('');
  const [time_out, setTimeOut] = useState('');


  useEffect(() => {
    const fetchSession = async () => {
      if (role === null) {
        alert('Please login first');
        navigate('/login');
      } else {
        fetch_visitors();
      }
    };

    fetchSession();
  }, [navigate]);


  const fetch_visitors = async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0'); 

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('date', formattedDate)
        .eq('department', role);

      if (error) throw error;

      const sortedData = data.sort((a, b) => {
        return new Date(b.time_in) - new Date(a.time_in);
      });

      setVisitorData(sortedData);
      const filteredData = data.filter(row => row.time_in === null);
      setExpectedVisitors(filteredData.length);
      setTimeIn(data.filter(row => row.time_in !== null).length);
      setTimeOut(data.filter(row => row.time_out !== null).length);
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error('Error during registration:', error.message);
    }
  };

  function extractTimeFromDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

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

  const logout = () =>
  {
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 font-mono relative">
      <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-end p-4">
        <button className="flex items-center bg-green-900 text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 rounded shadow"
        onClick={openModal}>
            <FaRegUserCircle className="mr-1" /> 
            {role}
        </button>
        </div>
        <main className="h-[80vh] p-4 lg:p-8 flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 w-full">
            {[
              {
                title: 'Expected Visitors',
                count: expectedVisitors,
                icon: '👥',
                bgColor: 'bg-blue-400',
              },
              {
                title: "Today's Entries",
                count: time_in,
                icon: '➡️',
                bgColor: 'bg-green-400',
              },
              {
                title: "Today's Exits",
                count: time_out,
                icon: '⬅️',
                bgColor: 'bg-yellow-400',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg shadow-lg p-4 lg:p-6 text-white text-center`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl lg:text-4xl font-bold">
                    {item.count}
                  </h3>
                  <span className="text-xl lg:text-2xl">{item.icon}</span>
                </div>
                <p className="text-xs lg:text-sm mt-2">{item.title}</p>
              </div>
            ))}
          </div>

          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-7 text-center">
            <div className="flex items-center justify-center mb-4">
                <span className="mr-2">
                <IoIosPeople size={32} />
                </span>
                <h2 className="text-lg lg:text-xl font-bold">
                Today's Visitors
                </h2>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full table-auto">
                <thead>
                    <tr className="border-b">
                    {['Name', 'Contact No.', 'Address', 'Purpose', 'Time In', 'Time Out'].map((header, index) => (
                        <th key={index} className="text-left p-2">
                        {header}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {visitorData.map((visitor, index) => (
                    <tr key={index} className="border-b">
                        <td className="p-2 text-left">{visitor.name}</td>
                        <td className="p-2 text-left">{visitor.contact_num}</td>
                        <td className="p-2 text-left">{visitor.address}</td>
                        <td className="p-2 text-left">{visitor.visit_purpose}</td>
                        <td className="p-2 text-left">{visitor.time_in === null ? '' : extractTimeFromDate(visitor.time_in)}</td>
                        <td className="p-2 text-left">{visitor.time_out === null ? '' : extractTimeFromDate(visitor.time_out)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </main>
      </div>
      <dialog id="error_modal" className="modal">
  <div className="modal-box max-w-xs flex flex-col items-center justify-center"> 
    <form method="dialog" className="w-full"> 
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={closeModal}
      >
        ✕
      </button>
    </form>
    <h3 className="font-bold text-lg text-center">Do you want to logout?</h3> 
    <div className="w-full flex justify-center">
      <button
      onClick={logout}
        className="mt-5 w-full sm:w-auto px-12 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
        Logout
      </button>
    </div>
  </div>
</dialog>

    </div>
    
  );
};

export default Notifications;
