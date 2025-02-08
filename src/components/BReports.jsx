import React, { useState, useEffect } from 'react';
import BSidebar from './BSidebar.jsx';
import { RiArchiveStackFill } from 'react-icons/ri';
import { FaFilePdf } from 'react-icons/fa';
import supabase from '../supabaseClient.jsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const BReports = () => {
  const [visitorsData, setVisitorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [total_visitors, setTotalVisitors] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const role = sessionStorage.getItem('role');

  const fetch_visitors = async () => {
    try {
      const { error, data } = await supabase
        .from('visitors')
        .select('*')
        .eq('department', role);
      if (error) throw error;

      const sortedData = data.sort(
        (a, b) => new Date(b.time_in) - new Date(a.time_in)
      );
      setVisitorData(sortedData);
      setTotalVisitors(sortedData.length);
      setFilteredData(sortedData);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Error during fetching visitors:', error.message);
    }
  };

  useEffect(() => {
    fetch_visitors();
  }, []);

  useEffect(() => {
    const filtered = visitorsData.filter((visitor) => {
      const date = new Date(visitor.time_in);
      const month = date.getMonth() + 1; // Months are 0-indexed
      const year = date.getFullYear();

      const matchesMonth = selectedMonth
        ? month === parseInt(selectedMonth, 10)
        : true;
      const matchesYear = selectedYear
        ? year === parseInt(selectedYear, 10)
        : true;

      return matchesMonth && matchesYear;
    });

    setFilteredData(filtered);
  }, [selectedMonth, selectedYear, visitorsData]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const updateVisitorStatus = async () => {
    if (!selectedVisitor || !newStatus) return;
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ status: newStatus })
        .eq('id', selectedVisitor.id);
      if (error) throw error;

      const updatedData = visitorsData.map((visitor) =>
        visitor.id === selectedVisitor.id
          ? { ...visitor, status: newStatus }
          : visitor
      );
      setVisitorData(updatedData);
      setFilteredData(updatedData);
      setShowModal(false);
      setSelectedVisitor(null);
      setNewStatus('');
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    }
  };

  const updateVisitorBlock = async () => {
    if (!selectedVisitor) return;
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ block: 'Pending' })
        .eq('id', selectedVisitor.id);
      if (error) throw error;

      addBlock();
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    }
  };

  const addBlock = async () => {
    const { data, error } = await supabase.from('block').insert([
      {
        name: selectedVisitor.name,
        reason,
      },
    ]);
    window.location.reload();

    if (error) {
      console.error('Error inserting data:', error);
      alert('Error inserting data');
    } else {
      console.log('Data inserted successfully:', data);
    }
  };

  useEffect(() => {
    fetch_visitors();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape', // More width for better layout
      unit: 'mm',
      format: 'a4',
    });
  
    doc.setFontSize(12);
    doc.text('Visitor Archives', 14, 15);
  
    const tableData = filteredData.map((visitor) => [
      visitor.name,
      visitor.contact_num,
      visitor.visit_purpose,
      visitor.department,
      visitor.vehicle,
      visitor.time_in ? extractTimeFromDate(visitor.time_in) : '',
      visitor.time_out ? extractTimeFromDate(visitor.time_out) : '',
      visitor.date,
    ]);
  
    doc.autoTable({
      head: [
        [
          'Name',
          'Contact No.',
          'Purpose of Visit',
          'Department',
          'Vehicle',
          'Time In',
          'Time Out',
          'Date',
        ],
      ],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8, cellPadding: 2 }, // Consistent styling
      columnStyles: {
        0: { cellWidth: 35 }, // Name
        1: { cellWidth: 30 }, // Contact No.
        2: { cellWidth: 50 }, // Purpose of Visit
        3: { cellWidth: 40 }, // Department
        4: { cellWidth: 30 }, // Vehicle
        5: { cellWidth: 25 }, // Time In
        6: { cellWidth: 25 }, // Time Out
        7: { cellWidth: 30 }, // Date
      },
      theme: 'grid',
      styles: { overflow: 'linebreak' }, // Ensures text wraps properly
      margin: { top: 20, left: 10, right: 10 },
      didDrawPage: function (data) {
        let pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      },
    });
  
    doc.save('visitor_archives.pdf');
  };
  

  function extractTimeFromDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

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

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-sans">
        <BSidebar />
        <main className="flex-1 lg:p-4 ml-0 lg:ml-56 transition-all duration-300">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="mr-2">
                  <RiArchiveStackFill size={30} />
                </span>
                <h2 className="text-lg lg:text-xl font-bolder text-gray-700">
                  Archives & Report Information
                </h2>
              </div>
              <button
                className="w-full sm:w-auto px-4 py-2 font-medium text-white bg-orange-500 rounded hover:bg-orange-400 flex items-center justify-center"
                onClick={() => exportToPDF()}
              >
                <FaFilePdf className="me-1" size={22} />
                Export as PDF
              </button>
            </div>

            <div className="flex justify-between sm:flex-row items-start sm:items-center gap-5 w-full sm:w-auto mb-6">
              <div className="gap-3 flex">
                <select
                  className="p-2 border rounded"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', {
                        month: 'long',
                      })}
                    </option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <option value="">All Years</option>
                  {[2022, 2023, 2024, 2025].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
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
            </div>

            {/* Visitor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-base sm:text-base table">
                <thead>
                  <tr className="border-b text-gray-700">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Contact No.</th>
                    <th className="text-left p-2">Vehicle</th>
                    <th className="text-left p-2">Plate Number</th>
                    <th className="text-left p-2">Type of Visitor</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Request Block</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((visitor) => (
                    <tr key={visitor.id} className="border-b text-gray-700">
                      <td>{visitor.name}</td>
                      <td>{visitor.contact_num}</td>
                      <td>{visitor.vehicle}</td>
                      <td>{visitor.plate_num}</td>
                      <td>{visitor.type_of_visitor}</td>

                      {/* Status Text Button */}
                      <td className="p-1">
                        <span
                          className={`underline cursor-pointer ${
                            visitor.status === 'Not Attended'
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`}
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setNewStatus(visitor.status);
                            setShowModal(true);
                          }}
                        >
                          {visitor.status}
                        </span>
                      </td>

                      {/* Block Text Button */}
                      <td className="p-1">
                        <span
                          className={`cursor-pointer ${
                            visitor.block === 'Blocked'
                              ? 'text-gray-500 no-underline'
                              : visitor.block === 'Pending' || !visitor.block
                                ? 'underline text-orange-600'
                                : 'underline text-yellow-400'
                          }`}
                          onClick={() => {
                            if (visitor.block !== 'Blocked') {
                              setSelectedVisitor(visitor);
                              setBlockModal(true);
                            }
                          }}
                          style={{
                            pointerEvents:
                              visitor.block === 'Blocked' ? 'none' : 'auto',
                          }}
                        >
                          {visitor.block ? visitor.block : 'Request'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-mono">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Change Status</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Dropdown for Status */}
            <div className="mb-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select New Status:
              </label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Not Attended">Not Attended</option>
                <option value="Attended">Attended</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={updateVisitorStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {blockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-mono">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Reason for Blocking
              </h2>
              <button
                onClick={() => setBlockModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Please provide a reason:
              </label>
              <textarea
                id="reason"
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason for blocking"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                onClick={() => setBlockModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={updateVisitorBlock}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BReports;
