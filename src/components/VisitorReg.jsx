import React, { useState } from 'react';
import { FaUser, FaAddressCard, FaCar } from 'react-icons/fa';
import { MdContactPhone, MdOutlineConfirmationNumber } from 'react-icons/md';
import supabase from '../supabaseClient';
import QRCode from 'qrcode';

const VisitorReg = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [plateNum, setPlateNum] = useState('');
  const [date, setDate] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrcode, setQrCode] = useState('');
  const [visitorType, setVisitorType] = useState('');

  const insertVisitorData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          name: name,
          address: address,
          contact_num: contactNum,
          visit_purpose: visitPurpose,
          vehicle: vehicle,
          plate_num: plateNum,
          date:date,
          department:department,
          type_of_visitor: visitorType,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      alert('Error inserting data');
    } else {
      console.log('Data inserted successfully:', data);
      generateQRCode(name);
    }
    setIsLoading(false);
  };

  const generateQRCode = async (name) => {
    try {
      const data = await QRCode.toDataURL(name);
      setQrCode(data);
      console.log(data);
      openModal();
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const openModal = () => {
    const modal = document.getElementById('error_modal');
    if (modal) {
      modal.showModal();

    }
  };

  const closeModal = () => {
    const modal = document.getElementById('error_modal');
    if (modal) {
      modal.close();
      window.location.reload();
    }
  };
  const saveimage = () => {
    if (qrcode.startsWith('data:image/png;base64,' || qrcode.startsWith('data:image/jpeg;base64,' ))) {
      const link = document.createElement('a');
      link.href = qrcode; 
      link.download = `qr-code.jpg`; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
    } else {
      console.error('Invalid QR code link');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-green-900 font-mono px-4 sm:px-0">
        <div className="w-full sm:w-3/4 lg:w-2/5 p-5 bg-white rounded-lg">
        <div className='flex flex-col sm:flex-row gap-4'>
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-cente flex-1">
            Visitor Registration
          </h1>
          <select className="select select-bordered " onChange={(e) => setVisitorType(e.target.value)}
         >
              <option disabled selected>
                Type of Visitor
              </option>
              <option>Family</option>
              <option>Organization</option>
              <option>VIP</option>
              <option>Others</option>
            </select>
        </div>
          <form className="space-y-4" onSubmit={insertVisitorData}>
            <div className>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Fullname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>

            <div>
              <label className="input input-bordered flex items-center gap-2">
                <FaAddressCard className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>
            </div>

            <div>
              <label className="input input-bordered flex items-center gap-2">
                <MdContactPhone className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Contact No."
                  value={contactNum}
                  onChange={(e) => setContactNum(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm text-gray-700 mb-1 font-bold"
              >
                Purpose of Visit
              </label>
              <textarea
                id="purpose"
                name="purpose"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300"
                value={visitPurpose}
                onChange={(e) => setVisitPurpose(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
            <select className="select select-bordered w-full flex-1"
            onChange={(e) => setDepartment(e.target.value)}>
              <option>REGISTRAR</option>
              <option>NEW ADMIN</option>
              <option>LIBRARY</option>
              <option>CAA</option>
              <option>CCIS</option>
              <option>CED</option>
              <option>CEGS</option>
              <option>CHASS</option>
              <option>CMNS</option>
              <option>COFES</option>
            </select>
            <label
                className="text-sm text-gray-700 font-bold mb-2"
              >
               Appointment
            <input 
              onChange={(e) => setDate(e.target.value)}
              placeholder="Select Date of Appointment"
              type="date" 
              class="ms-2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue"
            />
           </label>
          </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="input input-bordered flex items-center gap-2">
                  <FaCar className="h-5 w-5 opacity-70" />
                  <input
                    type="text"
                    className="grow py-2"
                    placeholder="Vehicle"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="input input-bordered flex items-center gap-2">
                  <MdOutlineConfirmationNumber className="h-5 w-5 opacity-70" />
                  <input
                    type="text"
                    className="grow py-2"
                    placeholder="Plate No."
                    value={plateNum}
                    onChange={(e) => setPlateNum(e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center content-center">
              <button
                type="submit"
                className="mt-5 w-full sm:w-auto px-12 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <dialog id="error_modal" className="modal">
        <div className="modal-box w-60">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Register Successfully</h3>
          <p className="py-4">Here's your QR Code:
            <div style={{ marginTop: '20px' }}>
           <img src={qrcode} alt="QR Code" style={{ width: '200px', height: '200px' }} />
           <button
           onClick={saveimage}
                className="mt-5 w-full sm:w-auto px-12 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                Save QR Code
              </button>
            </div>
          </p>
        </div>
      </dialog>
    </>
  );
};

export default VisitorReg;
