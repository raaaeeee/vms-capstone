import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Sidebar from './Sidebar.jsx';
import { IoIosPeople } from 'react-icons/io';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const [visitorData, setVisitorData] = useState([]);
  const [expectedVisitors, setExpectedVisitors] = useState('');
  const [time_in, setTimeIn] = useState('');
  const [time_out, setTimeOut] = useState('');
  const [future_visitors,setFutureVisitors] = useState('');
  const [event, setEvents] = useState([]);

  useEffect(() => {
    const fetchSession = async () => {
      if (role === null) {
        alert('Please login first');
        navigate('/login');
      } else {
        fetch_visitors();
        fetch_future_visitors();
        fetch_events();
      }
    };

    fetchSession();
  }, [navigate]);

  const localizer = momentLocalizer(moment);

  const mappedEvents = event.map(event => ({
    id: event.event_name, // Use a unique identifier for each event
    title: event.event_name,
    start: new Date(event.event_date), // Convert string to Date
    end: new Date(new Date(event.event_date).getTime() + 60 * 60 * 1000), // Adding 1 hour for the end time
  }));


  const fetch_visitors = async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0'); 

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    try {
        const { error, data } = await supabase
            .from('visitors')
            .select('*')
            .eq('date', formattedDate);

            console.log(data);
            const filteredData = data.filter(row => row.time_in === null);
            setVisitorData(filteredData);
            const expected_visitors = data.filter(row => row.time_in === null).length;
            setExpectedVisitors(expected_visitors);
            const time_in = data.filter(row => row.time_in !== null).length;
            setTimeIn(time_in);
            const time_out = data.filter(row => row.time_out !== null).length;
            setTimeOut(time_out);
    } catch (error) {
        alert("An unexpected error occurred.");
        console.error('Error during registration:', error.message);
    }
}
const fetch_future_visitors = async () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${yyyy}-${mm}-${dd}`;
  
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*');
      
    if (error) {
      throw error;
    }
    const futureData = data.filter(row => new Date(row.date) > new Date(formattedDate));
    setFutureVisitors(futureData.length);
  } catch (error) {
    alert("An unexpected error occurred.");
    console.error('Error during registration:', error.message);
  }
};


const fetch_events = async () => {
  try {
      const { error, data } = await supabase
          .from('events')
          .select('*')
          setEvents(data);
        
  } catch (error) {
      alert("An unexpected error occurred.");
      console.error('Error during registration:', error.message);
  }
}


  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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
              {
                title: 'Pending Total Visits',
                count: future_visitors,
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
                Today's Expected Visitors
              </h2>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['Name', 'Contact No.', 'Purpose', 'Department', 'Type of Visit'].map(
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
                    <td className="p-2">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.department}</td>
                    <td className="p-2">{visitor.type_of_visitor}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          <div className="w-full bg-white rounded-lg shadow-lg p-4">
            <Calendar
              localizer={localizer}
              events={mappedEvents}
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
