import Sidebar from './Sidebar.jsx';
import { RiArchiveStackFill } from 'react-icons/ri';
import { FaFilePdf } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';

const Archives = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="w-full bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="mr-2">
                  <RiArchiveStackFill size={30} />
                </span>
                <h2 className="text-lg lg:text-xl font-bolder">
                  Archives & Report Information
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full sm:w-auto">
                <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
                  <input type="text" className="grow" placeholder="Search" />
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
                <button className="w-full sm:w-auto px-4 py-2 font-medium text-white bg-orange-500 rounded hover:bg-orange-400 flex items-center justify-center">
                  <FaFilePdf className="me-1" size={22} />
                  Export as PDF
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 mt-8">
              <label className="input flex items-center gap-3 w-full sm:w-auto">
                <MdEventAvailable size={20} /> :
                <input type="date" required />
              </label>
              <label className="input flex items-center w-full sm:w-auto">
                Total No. of Visitors : &nbsp;
                <input placeholder="9999" type="text" disabled />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Contact No.</th>
                    <th className="text-left p-2">Purpose of Visit</th>
                    <th className="text-left p-2">Vehicle</th>
                    <th className="text-left p-2 border-b-4 border-green-400">
                      Time In
                    </th>
                    <th className="text-left p-2 border-b-4 border-red-400">
                      Time Out
                    </th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.from({ length: 13 }, (_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">Marc Dominic Gerasmio</td>
                      <td className="p-2">09090909090</td>
                      <td className="p-2">Transcript of Records (TOR)</td>
                      <td className="p-2">Motor</td>
                      <td className="p-2">7:00 AM</td>
                      <td className="p-2">7:00 PM</td>
                      <td className="p-2">10/18/2024</td>
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

export default Archives;
