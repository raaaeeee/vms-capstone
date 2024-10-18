import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Sidebar from './Sidebar.jsx';
import { IoIosPeople } from 'react-icons/io';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error.message);
        alert('Error fetching session. Please try again later.');
        navigate('/login');
      } else if (!session) {
        navigate('/login');
        alert('Please login first');
      }
    };

    fetchSession();
  }, [navigate]);

  const localizer = momentLocalizer(moment);

  const events = [
    {
      title: 'SANGKA 2024',
      start: new Date(2024, 9, 20, 10, 0), // October 20, 2024 at 10 AM
      end: new Date(2024, 9, 20, 12, 0),
    },
    {
      title: 'LCO Days',
      start: new Date(2024, 9, 21, 14, 0), // October 21, 2024 at 2 PM
      end: new Date(2024, 9, 21, 15, 0),
    },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              {
                title: 'Expected Visitors',
                count: 11,
                icon: '👥',
                bgColor: 'bg-blue-400',
              },
              {
                title: "Today's Entries",
                count: 22,
                icon: '➡️',
                bgColor: 'bg-green-400',
              },
              {
                title: "Today's Exits",
                count: 18,
                icon: '⬅️',
                bgColor: 'bg-yellow-400',
              },
              {
                title: 'Pending Total Visits',
                count: 30,
                icon: '⏳',
                bgColor: 'bg-purple-400',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg shadow-lg p-4 lg:p-6 text-white`}
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

          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-7">
            <div className="flex items-center mb-4">
              <span className="mr-2">
                <IoIosPeople size={32} />
              </span>
              <h2 className="text-lg lg:text-xl font-bolder">
                Today's Visitors
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['Visitor No.', 'Name', 'Contact No.', 'Purpose'].map(
                      (header, index) => (
                        <th key={index} className="text-left p-2">
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 9 }, (_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">Marc Dominic Gerasmio</td>
                      <td className="p-2">09090909090</td>
                      <td className="p-2">Transcript of Records (TOR)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full bg-white rounded-lg shadow-lg p-4">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '400px' }}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
