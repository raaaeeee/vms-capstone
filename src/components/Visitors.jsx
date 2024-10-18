import Sidebar from './Sidebar';
import { IoIosPeople } from 'react-icons/io';
import supabase from '../supabaseClient';
import { useState, useEffect } from 'react';

const Visitors = () => {

const [visitorsData, setVisitorData] = useState([]);

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
            const filteredData = data.filter(row => row.time_in != null);
            setVisitorData(filteredData);

    } catch (error) {
        alert("An unexpected error occurred.");
        console.error('Error during registration:', error.message);
    }
}

function extractTimeFromDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

useEffect(() => {
  fetch_visitors();
}, []);
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex items-center mb-4">
              <span className="mr-2">
                <IoIosPeople size={32} />
              </span>
              <h2 className="text-lg lg:text-xl font-bolder">
                Visitor's Time In & Out
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th key={1} className="text-left p-2">
                      Name
                    </th>
                    <th key={2} className="text-left p-2">
                      Contact No.
                    </th>
                    <th key={3} className="text-left p-2">
                      Purpose of Visit
                    </th>
                    <th key={4} className="text-left p-2">
                      Deparment
                    </th>
                    <th key={5} className="text-left p-2">
                      Vehicle
                    </th>
                    <th
                      key={6}
                      className="text-left p-2 border-b-4 border-green-400"
                    >
                      Time In
                    </th>
                    <th
                      key={7}
                      className="text-left p-2 border-b-4 border-red-400"
                    >
                      Time Out
                    </th>
                  </tr>
                </thead>

                <tbody>
                   {visitorsData.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.contact_num}</td>
                    <td className="p-2">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.department}</td>
                    <td className="p-2">{visitor.vehicle}</td>
                    <td className="p-2">{visitor.time_in === null ? '' : extractTimeFromDate(visitor.time_in)}</td>
                    <td className="p-2"> {visitor.time_out === null ? '' : extractTimeFromDate(visitor.time_out)}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Visitors;
