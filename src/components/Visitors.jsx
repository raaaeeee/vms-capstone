import Sidebar from './Sidebar';
import { IoIosPeople } from 'react-icons/io';

const Visitors = () => {
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
                    <th key={0} className="text-left p-2">
                      #
                    </th>
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
                      Vehicle
                    </th>
                    <th
                      key={5}
                      className="text-left p-2 border-b-4 border-green-400"
                    >
                      Time In
                    </th>
                    <th
                      key={6}
                      className="text-left p-2 border-b-4 border-red-400"
                    >
                      Time Out
                    </th>
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
