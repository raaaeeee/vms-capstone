import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { IoIosPeople } from 'react-icons/io';
import { FaRegUserCircle } from 'react-icons/fa';
import BSidebar from './BSidebar';

const Notifications = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');
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
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('date', formattedDate)
        .eq('department', role);

      if (error) throw error;

      const sortedData = data.sort((a, b) => new Date(b.time_in) - new Date(a.time_in));
      setVisitorData(sortedData);
      const filteredData = data.filter(row => row.time_in === null);
      setExpectedVisitors(filteredData.length);
      setTimeIn(data.filter(row => row.time_in !== null).length);
      setTimeOut(data.filter(row => row.time_out !== null).length);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Error during registration:', error.message);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <BSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300 bg-gray-100">
          <main className="h-[80vh] p-4 lg:p-8">
            {/* Visitor Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
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
                    <h3 className="text-2xl lg:text-4xl font-bold">{item.count}</h3>
                    <span className="text-xl lg:text-2xl">{item.icon}</span>
                  </div>
                  <p className="text-xs lg:text-sm mt-2">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Visitor Table */}
            <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
              <div className="flex items-center justify-center mb-4">
                <IoIosPeople size={32} className="mr-2" />
                <h2 className="text-lg lg:text-xl font-bold">Today's Visitors</h2>
              </div>
              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      {['Name', 'Contact No.', 'Address', 'Purpose', 'Time In', 'Time Out'].map(
                        (header, index) => (
                          <th key={index} className="text-left p-2">
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {visitorData.map((visitor, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{visitor.name}</td>
                        <td className="p-2">{visitor.contact_num}</td>
                        <td className="p-2">{visitor.address}</td>
                        <td className="p-2">{visitor.visit_purpose}</td>
                        <td className="p-2">
                          {visitor.time_in ? new Date(visitor.time_in).toLocaleTimeString() : ''}
                        </td>
                        <td className="p-2">
                          {visitor.time_out ? new Date(visitor.time_out).toLocaleTimeString() : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Notifications;
