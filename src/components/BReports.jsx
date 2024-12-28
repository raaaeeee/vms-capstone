import React, { useState, useEffect } from 'react';
import BSidebar from './BSidebar.jsx';
import { RiArchiveStackFill } from 'react-icons/ri';
import { FaFilePdf } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
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
  const role = sessionStorage.getItem('role');

  const fetch_visitors = async () => {
    try {
      const { error, data } = await supabase
        .from('visitors')
        .select('*')
        .eq('department', role);
      if (error) throw error;

      const sortedData = data.sort((a, b) => new Date(b.time_in) - new Date(a.time_in));
      setVisitorData(sortedData);
      setTotalVisitors(sortedData.length);
      setFilteredData(sortedData);
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Error during fetching visitors:', error.message);
    }
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
        visitor.id === selectedVisitor.id ? { ...visitor, status: newStatus } : visitor
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
    const { data, error } = await supabase
      .from('block')
      .insert([
        {
         name : selectedVisitor.name,
         reason,
        },
      ])
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
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text('Visitor Archives', 14, 16);
    
    const tableData = filteredData.map(visitor => [
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
      head: [['Name', 'Contact No.', 'Purpose of Visit', 'Department', 'Vehicle', 'Time In', 'Time Out', 'Date']],
      body: tableData,
      startY: 30,
    });

    doc.save('visitor_archives.pdf');
  };

  function extractTimeFromDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const newData = visitorsData.filter(data =>
      data.name ? data.name.toLowerCase().includes(searchTerm) : false
    );
    setFilteredData(newData);  
  }, [search, visitorsData]); 

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };


  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <BSidebar />
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="mr-2">
                  <RiArchiveStackFill size={30} />
                </span>
                <h2 className="text-lg lg:text-xl font-bolder">Archives & Report Information</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full sm:w-auto">
                <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
                  <input type="text" className="grow" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
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
                  className="w-full sm:w-auto px-4 py-2 font-medium text-white bg-orange-500 rounded hover:bg-orange-400 flex items-center justify-center"
                  onClick={() => exportToPDF()}
                >
                  <FaFilePdf className="me-1" size={22} />
                  Export as PDF
                </button>
              </div>
            </div>

            {/* Visitor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b">
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
                    <tr key={visitor.id} className="border-b">
                      <td className="p-1">{visitor.name}</td>
                      <td className="p-1">{visitor.contact_num}</td>
                      <td className="p-1">{visitor.vehicle}</td>
                      <td className="p-1">{visitor.plate_num}</td>
                      <td className="p-1">{visitor.type_of_visitor}</td>
                      <td className="p-1">
                        <button
                          className={`px-3 py-1 rounded ${
                            visitor.status === 'Not Attended' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                          }`}
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setNewStatus(visitor.status);
                            setShowModal(true);
                          }}
                        >
                          {visitor.status}
                        </button>
                      </td>
                      <td className="p-1">
                    <button
                        className={`px-3 py-1 rounded ${
                            visitor.block === 'Pending' || visitor.block === '' || visitor.block === null  ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        } ${visitor.block === null ? '' : 'cursor-not-allowed'}`}
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setBlockModal(true);
                        }}
                        disabled={visitor.block !== null && visitor.block !== ''}
                    >
                        {visitor.block ? visitor.block : 'Request'}
                    </button>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Status</h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Not Attended">Not Attended</option>
              <option value="Attended">Attended</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={updateVisitorStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

{blockModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Reason for Blocking:</h2>

      <div className="mb-4">
        <input
          id="reason"
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter reason for blocking"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setBlockModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
