import React, { useState } from 'react';
import { FaUser, FaAddressCard, FaCar } from 'react-icons/fa';
import { GoOrganization } from "react-icons/go";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdContactPhone, MdOutlineConfirmationNumber } from 'react-icons/md';
import supabase from '../supabaseClient';
import QRCode from 'qrcode';

const VisitorReg = () => {
  const [file, setFile] = useState('');
  const [image_link, setImageLink] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [plateNum, setPlateNum] = useState('');
  const [date, setDate] = useState('');
  const [department, setDepartment] = useState('');
  const [relationship, setRelationship] = useState('');
  const [employee, setEmployee] = useState('');
  const [numberOfPassengers, setNumberofPassengers] = useState('');
  const [orgtype, setOrgType] = useState('');
  const [numberofVehicles, setNumberOfVehicles] = useState('');
  const [totalVisitors, setTotalVisitors] = useState('');
  const [vipname, setVipName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [qrcode, setQrCode] = useState('');
  const [visitorType, setVisitorType] = useState('');

  const insertVisitorData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isBlocked = await checkNameInBlock(name);
    if (isBlocked) {
      alert('Entered Name is blocked. Contact Administration for unblocking');
      setIsLoading(false);
      return;
    }

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

  const registerFamily = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isBlocked = await checkNameInBlock(name);
    if (isBlocked) {
      alert('Entered Name is blocked. Contact Administration for unblocking');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          name,
          address,
          contact_num: contactNum,
          relationship,
          employee,
          date,
          visit_purpose: visitPurpose,
          vehicle,
          plate_num: plateNum,
          numberOfPassengers,
          type_of_visitor: visitorType,
          image_link,
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

  const registerOrganization = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isBlocked = await checkNameInBlock(name);
    if (isBlocked) {
      alert('Entered Name is blocked. Contact Administration for unblocking');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          name,
          orgtype,
          address,
          contact_num: contactNum,
          date,
          visit_purpose: visitPurpose,
          numberOfPassengers,
          numberOfVehicles: numberofVehicles,
          vehicle,
          plate_num: plateNum,
          totalVisitors,
          type_of_visitor: visitorType,
          image_link,
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

  const registerVIP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isBlocked = await checkNameInBlock(name);
    if (isBlocked) {
      alert('Entered Name is blocked. Contact Administration for unblocking');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          name,
          vipname,
          address,
          contact_num: contactNum,
          date,
          visit_purpose: visitPurpose,
          numberOfPassengers,
          numberOfVehicles: numberofVehicles,
          vehicle,
          plate_num: plateNum,
          totalVisitors,
          type_of_visitor: visitorType,
          image_link,
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
  const checkNameInBlock = async (name) => {
    const { data, error } = await supabase
      .from('block')
      .select('*')
      .eq('name', name);
  
    if (error) {
      console.error('Error checking block table:', error);
      alert('Error checking block table');
      return false;
    }
  
    return data.length > 0; 
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
    if (
      qrcode.startsWith("data:image/png;base64,") ||
      qrcode.startsWith("data:image/jpeg;base64,")
    ) {
    
      const canvas = document.createElement("canvas");
      const image = new Image();
    
      const scaleFactor = 4; 
      image.src = qrcode;
  
      image.onload = () => {
     
        canvas.width = image.width * scaleFactor;
        canvas.height = image.height * scaleFactor;
        const ctx = canvas.getContext("2d");
  
       
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
      
        const enlargedImage = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = enlargedImage;
        link.download = `qr-code-large.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    } else {
      console.error("Invalid QR code link");
    }
  };
  

  const handleImage = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      try {
        const filePath = `${selectedFile.name}`;
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(filePath, selectedFile);
        if (error) {
          throw error;
        }
        const { data: publicURL, error: urlError } = supabase.storage
          .from("Images")
          .getPublicUrl(filePath);
        if (urlError) {
          throw urlError;
        }
        console.log("Image URL:", publicURL.publicUrl);
        setImageLink(publicURL.publicUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image: " + error.message);
      }
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
              <option>Attendee</option>
              <option>Guest</option>
              <option>Others</option>
            </select>
        </div>
          <form className="space-y-4" onSubmit={insertVisitorData}>
          {visitorType === 'Guest' && (
            <>
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
            </>
          )}
          {visitorType === 'Attendee' && (
            <>
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
            </>
          )}
          {visitorType === 'Others' && (
            <>
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
            </>
          )}
          {visitorType === 'Family' && (
            <>
             <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1">
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
            <div className="flex-1">
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className="h-5 w-5 opacity-70" />
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
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
            <div className='flex-1'>
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
            <div className='flex-1'>
              <label className="input input-bordered flex items-center gap-2">
                <MdContactPhone className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Relationship to Employee"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  required
                />
              </label>
            </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="input input-bordered flex items-center gap-2 flex-1">
                <MdContactPhone className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Name of Employee"
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  required
                />
              </label>
              <label
                className="text-sm text-gray-700 font-bold mb-2 flex-1"
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
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <FaCar className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="Vehicle Type"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <MdOutlineConfirmationNumber className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="Plate No."
                  value={plateNum}
                  onChange={(e) => setPlateNum(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="No. of Passengers"
                  value={numberOfPassengers}
                  onChange={(e) => setNumberofPassengers(e.target.value)}
                  required
                />
              </label>
            </div>
            </div>
            <div>
                <label className="label">
                  <span className="label-text">Upload list of people visiting</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImage}
                />
                   {image_link ? (
                    <p className="text-green-500 mt-2">
                    File Uploaded.
                    </p>
                    ) : (
                        <p className="text-red-500 mt-2">
                        No File selected. 
                        </p>
                    )}
              </div>
              <div className="flex justify-center content-center">
              <button
                onClick={registerFamily}
                className="mt-5 w-full sm:w-auto px-12 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Register'}
              </button>
            </div>
            </>
           )}
           {/* Organization */}
           {visitorType === 'Organization' && (
            <>
            <div className="flex flex-col sm:flex-row gap-4">
            <div className='flex-1'>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Name of Organization"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className='flex-1'>
              <label className="input input-bordered flex items-center gap-2">
                <GoOrganization  className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Type of Organization"
                  value={orgtype}
                  onChange={(e) => setOrgType(e.target.value)}
                  required
                />
              </label>
            </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
            <div className='flex-1'>
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
            <div className='flex-1'>
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
            </div>
            <div>
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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300"
                value={visitPurpose}
                onChange={(e) => setVisitPurpose(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-2">
                <label className="input input-bordered flex items-center gap-2">
                  <FaCar className="h-5 w-5 opacity-70" />
                  <input
                    type="text"
                    className="grow py-2"
                    placeholder="Number of Vehicles"
                    value={numberofVehicles}
                    onChange={(e) => setNumberOfVehicles(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="input input-bordered flex items-center gap-2">
                  <FaPeopleGroup  className="h-5 w-5 opacity-70" />
                  <input
                    type="text"
                    className="grow py-2"
                    placeholder="Number of People Visiting"
                    value={totalVisitors}
                    onChange={(e) => setTotalVisitors(e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <FaCar className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="Vehicle Type"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <MdOutlineConfirmationNumber className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="Plate No."
                  value={plateNum}
                  onChange={(e) => setPlateNum(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="No. of Passengers"
                  value={numberOfPassengers}
                  onChange={(e) => setNumberofPassengers(e.target.value)}
                  required
                />
              </label>
            </div>
            </div>
            <div>
                <label className="label">
                  <span className="label-text">Upload list of people visiting</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImage}
                />
                  {image_link ? (
                    <p className="text-green-500 mt-2">
                    File Uploaded.
                    </p>
                    ) : (
                        <p className="text-red-500 mt-2">
                        No File selected. 
                        </p>
                    )}
              </div>
              <div className="flex justify-center content-center">
              <button
                onClick={registerOrganization}
                className="mt-5 w-full sm:w-auto px-12 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Register'}
              </button>
            </div>
            </>
           )}
           {visitorType === 'VIP' && (
            <>
            <div className="flex flex-col sm:flex-row gap-4">
            <div className='flex-1'>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Name of Representative"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className='flex-1'>
              <label className="input input-bordered flex items-center gap-2">
                <FaUser  className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2"
                  placeholder="Who's Visiting"
                  value={vipname}
                  onChange={(e) => setVipName(e.target.value)}
                  required
                />
              </label>
            </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
            <div className='flex-1'>
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
            <div className='flex-1'>
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
            </div>
            <div>
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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-300"
                value={visitPurpose}
                onChange={(e) => setVisitPurpose(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-2">
                <label className="input input-bordered flex items-center gap-2">
                  <FaCar className="h-5 w-5 opacity-70" />
                  <input
                    type="text"
                    className="grow py-2"
                    placeholder="Number of Vehicles"
                    value={numberofVehicles}
                    onChange={(e) => setNumberOfVehicles(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="input input-bordered flex items-center gap-2">
                  <FaPeopleGroup  className="h-5 w-5 opacity-70" />
                  <input
                    type="text"
                    className="grow py-2"
                    placeholder="Number of People Visiting"
                    value={totalVisitors}
                    onChange={(e) => setTotalVisitors(e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <FaCar className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="Vehicle Type"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <MdOutlineConfirmationNumber className="h-5 w-5 opacity-70" />
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="Plate No."
                  value={plateNum}
                  onChange={(e) => setPlateNum(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="grow py-2 w-full"
                  placeholder="No. of Passengers"
                  value={numberOfPassengers}
                  onChange={(e) => setNumberofPassengers(e.target.value)}
                  required
                />
              </label>
            </div>
            </div>
            <div>
                <label className="label">
                  <span className="label-text">Upload list of people visiting</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImage}
                />
                  {image_link ? (
                    <p className="text-green-500 mt-2">
                    File Uploaded.
                    </p>
                    ) : (
                        <p className="text-red-500 mt-2">
                        No File selected. 
                        </p>
                    )}
              </div>
              <div className="flex justify-center content-center">
              <button
               onClick={registerVIP}
                className="mt-5 w-full sm:w-auto px-12 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Register'}
              </button>
            </div>
            </>
           )}
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
