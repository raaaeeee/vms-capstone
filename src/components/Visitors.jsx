import Sidebar from './Sidebar';
import { IoIosPeople } from 'react-icons/io';
import supabase from '../supabaseClient';
import { useState, useEffect } from 'react';

const Visitors = () => {
  const [visitorsData, setVisitorData] = useState([]);
  const [visitorType, setVisitorType] = useState('Type of Visitor');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageLink, setSelectedImageLink] = useState('');

  const fetch_visitors = async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0'); 
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    try {
      let query = supabase
        .from('visitors')
        .select('*')
        .eq('date', formattedDate);

      if (visitorType !== 'Type of Visitor') {
        query = query.eq('type_of_visitor', visitorType);
      }

      const { error, data } = await query;
      if (error) throw error;

      const sortedData = data.sort((a, b) => new Date(b.time_in) - new Date(a.time_in));
      setVisitorData(sortedData);

    } catch (error) {
      alert("An unexpected error occurred.");
      console.error('Error during data fetch:', error.message);
    }
  };

  function extractTimeFromDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  useEffect(() => {
    fetch_visitors();
  }, [visitorType]);

  const openModal = (imageLink) => {
    setSelectedImageLink(imageLink);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageLink('');
  };


  return (
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
            <select
              className="select select-bordered ml-auto"
              onChange={(e) => setVisitorType(e.target.value)}
            >
              <option>Type of Visitor</option>
              <option>Family</option>
              <option>Organization</option>
              <option>VIP</option>
              <option>Others</option>
            </select>
          </div>
          {visitorType === 'Type of Visitor' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Contact No.</th>
                  <th className="text-left p-2">Purpose of Visit</th>
                  <th className="text-left p-2">Type of Visitor</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Plate Number</th>
                  <th className="text-left p-2 border-b-4 border-green-400">Time In</th>
                  <th className="text-left p-2 border-b-4 border-red-400">Time Out</th>
                </tr>
              </thead>
              <tbody>
                {visitorsData.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.contact_num}</td>
                    <td className="p-2">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.type_of_visitor}</td>
                    <td className="p-2">{visitor.vehicle}</td>
                    <td className="p-2">{visitor.plate_num}</td>
                    <td className="p-2">{visitor.time_in ? extractTimeFromDate(visitor.time_in) : ''}</td>
                    <td className="p-2">{visitor.time_out ? extractTimeFromDate(visitor.time_out) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          {visitorType === 'Family' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Contact No.</th>
                  <th className="text-left p-1">Purpose of Visit</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Plate Number</th>
                  <th className="text-left p-2 border-b-4 border-green-400">Time In</th>
                  <th className="text-left p-2 border-b-4 border-red-400">Time Out</th>
                  <th className="text-left p-2">List of Names</th>
                </tr>
              </thead>
              <tbody>
                {visitorsData.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.contact_num}</td>
                    <td className="p-1">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.vehicle}</td>
                    <td className="p-2">{visitor.plate_num}</td>
                    <td className="p-2">{visitor.time_in ? extractTimeFromDate(visitor.time_in) : ''}</td>
                    <td className="p-2">{visitor.time_out ? extractTimeFromDate(visitor.time_out) : ''}</td>
                    <td className='p-2'><button className='border border-green-500 text-green-500 font-semibold py-2 px-4 rounded hover:bg-green-500 hover:text-white'
                     onClick={() => openModal(visitor.image_link)}>VIEW</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
    {visitorType === 'Organization' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Organization Name</th>
                  <th className="text-left p-2">Contact No.</th>
                  <th className="text-left p-1">Purpose of Visit</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Plate Number</th>
                  <th className="text-left p-2 border-b-4 border-green-400">Time In</th>
                  <th className="text-left p-2 border-b-4 border-red-400">Time Out</th>
                  <th className="text-left p-2">List of Names</th>
                </tr>
              </thead>
              <tbody>
                {visitorsData.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.contact_num}</td>
                    <td className="p-1">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.vehicle}</td>
                    <td className="p-2">{visitor.plate_num}</td>
                    <td className="p-2">{visitor.time_in ? extractTimeFromDate(visitor.time_in) : ''}</td>
                    <td className="p-2">{visitor.time_out ? extractTimeFromDate(visitor.time_out) : ''}</td>
                    <td className='p-2'><button className='border border-green-500 text-green-500 font-semibold py-2 px-4 rounded hover:bg-green-500 hover:text-white'
                     onClick={() => openModal(visitor.image_link)}>VIEW</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
      {visitorType === 'VIP' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Representative Name</th>
                  <th className="text-left p-2">VIP Name</th>
                  <th className="text-left p-2">Contact No.</th>
                  <th className="text-left p-1">Purpose of Visit</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Plate Number</th>
                  <th className="text-left p-2 border-b-4 border-green-400">Time In</th>
                  <th className="text-left p-2 border-b-4 border-red-400">Time Out</th>
                  <th className="text-left p-2">List of Names</th>
                </tr>
              </thead>
              <tbody>
                {visitorsData.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.vipname}</td>
                    <td className="p-2">{visitor.contact_num}</td>
                    <td className="p-1">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.vehicle}</td>
                    <td className="p-2">{visitor.plate_num}</td>
                    <td className="p-2">{visitor.time_in ? extractTimeFromDate(visitor.time_in) : ''}</td>
                    <td className="p-2">{visitor.time_out ? extractTimeFromDate(visitor.time_out) : ''}</td>
                    <td className='p-2'><button className='border border-green-500 text-green-500 font-semibold py-2 px-4 rounded hover:bg-green-500 hover:text-white'
                    onClick={() => openModal(visitor.image_link)}>VIEW</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          {visitorType === 'Others' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Contact No.</th>
                  <th className="text-left p-2">Purpose of Visit</th>
                  <th className="text-left p-2">Type of Visitor</th>
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Plate Number</th>
                  <th className="text-left p-2 border-b-4 border-green-400">Time In</th>
                  <th className="text-left p-2 border-b-4 border-red-400">Time Out</th>
                </tr>
              </thead>
              <tbody>
                {visitorsData.map((visitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{visitor.name}</td>
                    <td className="p-2">{visitor.contact_num}</td>
                    <td className="p-2">{visitor.visit_purpose}</td>
                    <td className="p-2">{visitor.type_of_visitor}</td>
                    <td className="p-2">{visitor.vehicle}</td>
                    <td className="p-2">{visitor.plate_num}</td>
                    <td className="p-2">{visitor.time_in ? extractTimeFromDate(visitor.time_in) : ''}</td>
                    <td className="p-2">{visitor.time_out ? extractTimeFromDate(visitor.time_out) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
           {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96 h-auto max-w-xl max-h-[85vh] overflow-auto">
                <img src={selectedImageLink} alt="Visitor" className="max-w-full max-h-[80vh] object-contain" />
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Visitors;
