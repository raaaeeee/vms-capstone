import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosPeople } from 'react-icons/io';
import { FaRegUserCircle } from 'react-icons/fa';
import supabase from '../supabaseClient';
import BSidebar from './BSidebar';

const Notifications = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');
  const [visitorData, setVisitorData] = useState([]);
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [expectedCount, setExpectedCount] = useState('');
  const [pendingCount, setPendingCount] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      if (!role) {
        alert('Please login first');
        navigate('/login');
      } else {
        fetch_visitors();
        fetch_visitorsall();
      }
    };

    fetchSession();
  }, [navigate]);

  const fetch_visitors = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('date', formattedDate)
        .eq('department', role);

      if (error) throw error;

      const sortedData = data.sort(
        (a, b) => new Date(b.time_in) - new Date(a.time_in)
      );
      setVisitorData(sortedData);
      setExpectedCount(sortedData.length);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error(error.message);
    }
  };

  const fetch_visitorsall = async () => {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('department', role);

      if (error) throw error;

      const filteredData = data.filter((row) => row.time_in === null);
      setExpectedVisitors(filteredData);
      setPendingCount(filteredData.length);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-sans">
      <BSidebar />
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 lg:ml-56 transition-all duration-300">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-700 mt-1">Role: {role || 'N/A'}</p>
        </header>

        <main>
          {/* Visitor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-8">
            {[
              {
                title: 'Expected Visitors',
                count: expectedCount,
                icon: <FaRegUserCircle size={28} />,
                bgColor: 'bg-blue-500',
              },
              {
                title: 'Pending Visitors',
                count: pendingCount,
                icon: <IoIosPeople size={28} />,
                bgColor: 'bg-purple-500',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} text-white p-6 rounded-lg shadow-lg flex items-center gap-4`}
              >
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="text-3xl font-bold">{item.count}</h3>
                  <p className="text-sm">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visitors Table */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700  flex items-center gap-2 mb-4">
                <IoIosPeople size={20} />
                Today's Visitors
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto table text-left border-collapse">
                  <thead>
                    <tr>
                      {[
                        'Name',
                        'Contact No.',
                        'Address',
                        'Purpose',
                        'Time In',
                        'Time Out',
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-sm font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visitorData.length > 0 ? (
                      visitorData.map((visitor, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        
                        >
                          <td className="px-4 py-2 text-gray-700">{visitor.name}</td>
                          <td className="px-4 py-2 text-gray-700">{visitor.contact_num}</td>
                          <td className="px-4 py-2 text-gray-700">{visitor.address}</td>
                          <td className="px-4 py-2 text-gray-700">{visitor.visit_purpose}</td>
                          <td className="px-4 py-2 text-gray-700">
                            {visitor.time_in
                              ? new Date(visitor.time_in).toLocaleTimeString()
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-gray-700">
                            {visitor.time_out
                              ? new Date(visitor.time_out).toLocaleTimeString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No visitors found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pending List Table */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
                <IoIosPeople size={20} />
                Pending Visitors
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto table text-left border-collapse">
                  <thead>
                    <tr>
                      {['Name', 'Contact No.', 'Address', 'Purpose'].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-2 text-sm font-medium text-gray-700"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {expectedVisitors.length > 0 ? (
                      expectedVisitors.map((visitor, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <td className="px-4 py-2 text-gray-700">{visitor.name}</td>
                          <td className="px-4 py-2 text-gray-700">{visitor.contact_num}</td>
                          <td className="px-4 py-2 text-gray-700">{visitor.address}</td>
                          <td className="px-4 py-2 text-gray-700">{visitor.visit_purpose}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4 text-gray-500"
                        >
                          No pending visitors.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
