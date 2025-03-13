import BSidebar from './BSidebar.jsx';
import { RiArchiveStackFill } from 'react-icons/ri';
import { FaFilePdf } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
import supabase from '../supabaseClient.jsx';
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Blocklist = () => {
  const [visitorsData, setVisitorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [total_visitors, setTotalVisitors] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');

  const fetch_visitors = async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    try {
      const { error, data } = await supabase
        .from('block')
        .select('*')
        .eq('status', 'Blocked');

      if (error) throw error;

      const sortedData = data.sort((a, b) => {
        return new Date(b.time_in) - new Date(a.time_in);
      });

      setVisitorData(sortedData);
      setTotalVisitors(sortedData.length);
      setFilteredData(sortedData);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Error during fetching visitors:', error.message);
    }
  };

  const filter_date = async (date) => {
    if (date === '') {
      fetch_visitors();
    } else {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;

      try {
        const { error, data } = await supabase
          .from('block')
          .select('*')
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);

        if (error) throw error;

        const sortedData = data.sort((a, b) => {
          return new Date(b.time_in) - new Date(a.time_in);
        });

        setVisitorData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error('Error filtering data by date:', error.message);
      }
    }
  };

  useEffect(() => {
    fetch_visitors();
  }, []);

  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const newData = visitorsData.filter((data) =>
      data.name ? data.name.toLowerCase().includes(searchTerm) : false
    );
    setFilteredData(newData);
  }, [search, visitorsData]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  function extractTimeFromDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait', // Use portrait to match standard reports
      unit: 'mm',
      format: 'a4',
    });
    doc.setFontSize(12);
    doc.text('Blocklist', 14, 16);
    const tableData = filteredData.map((visitor) => [
      visitor.name,
      visitor.reason,
      formatDate(visitor.created_at),
    ]);
    doc.autoTable({
      head: [['Name', 'Reason for Blocking', 'Date Blocked']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 3 }, // Adjust font and padding
    columnStyles: {
      0: { cellWidth: 60 }, // Name column width
      1: { cellWidth: 80 }, // Reason column width
      2: { cellWidth: 40 }, // Date Blocked column width
    },
    theme: 'grid', // Adds grid lines for better readability
    styles: { overflow: 'linebreak' }, // Ensures text wraps properly
    margin: { top: 20, left: 10, right: 10 },
    });
    doc.save('blocklist.pdf');
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-sans">
        <BSidebar />
        <main className="flex-1 lg:p-3 ml-0 lg:ml-56 transition-all duration-300">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="mr-2">
                  <RiArchiveStackFill size={30} />
                </span>
                <h2 className="text-lg lg:text-xl font-bolder text-gray-700">Blocklist</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full sm:w-auto">
                <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Search"
                    onChange={handleSearchChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <button
                  className="w-full sm:w-auto px-4 py-2 font-medium text-white bg-red-500 rounded hover:bg-red-800 flex items-center justify-center"
                  onClick={exportToPDF}
                >
                  <FaFilePdf className="me-1" size={22} />
                  Export as PDF
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 mt-8">
              <label className="input flex items-center gap-3 w-full sm:w-auto">
                <MdEventAvailable size={20} /> :
                <input
                  type="date"
                  required
                  onChange={(e) => filter_date(e.target.value)}
                />
              </label>
              <label className="input flex items-center w-full sm:w-auto">
                Total No. of Blocked : &nbsp;
                <input placeholder={total_visitors} type="text" disabled />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table text-base sm:text-base">
                <thead>
                  <tr className="border-b text-gray-700 ">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Reason for blocking</th>
                    <th className="text-left p-2">Date Blocked</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((visitor, index) => (
                    <tr key={index} className="border-b text-gray-700">
                      <td>{visitor.name}</td>
                      <td>{visitor.reason}</td>
                      <td>{formatDate(visitor.created_at)}</td>
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

export default Blocklist;
