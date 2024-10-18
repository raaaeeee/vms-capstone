import Sidebar from './Sidebar.jsx';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MdEventAvailable } from 'react-icons/md';
import supabase from '../supabaseClient.jsx';
import { useState, useEffect } from 'react';
const Events = () => {
  const [event, setEvents] = useState([]);
  const [event_name, setEventName] = useState('');
  const [event_date, setEventDate] = useState('');
  const [event_location, setEventLocation] = useState('');



  const mappedEvents = event.map(event => ({
    id: event.event_name, // Use a unique identifier for each event
    title: event.event_name,
    start: new Date(event.event_date), // Convert string to Date
    end: new Date(new Date(event.event_date).getTime() + 60 * 60 * 1000), // Adding 1 hour for the end time
  }));

  const add_event = async (e) => {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          event_name,
          event_date,
          event_location
        },
      ])

    if (error) {
      console.error('Error inserting data:', error);
      alert('Error inserting data');
    } else {
      openModal();
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
  const localizer = momentLocalizer(moment);


  const openModal = () => {
    const modal = document.getElementById('check');
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('check');
    if (modal) {
      modal.close();
      window.location.reload();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    add_event();
  };

  useEffect(() => {
    fetch_events();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:py-24">
            <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3">
              <div className="flex items-center mb-10">
                <span className="mr-2">
                  <MdEventAvailable size={30} />
                </span>
                <h2 className="text-lg lg:text-xl font-bold">Create Event</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="input input-bordered flex items-center gap-2 text-gray-400"
                    htmlFor="eventName"
                  >
                    Event Name:
                    <input
                      id="eventName"
                      type="text"
                      className="grow text-black"
                      value={event_name}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </label>
                </div>

                <div className="mb-4">
                  <label
                    className="input input-bordered flex items-center gap-2 text-gray-400"
                    htmlFor="eventDate"
                  >
                    Event Date:
                    <input
                      id="eventDate"
                      type="date"
                      className="grow text-black"
                      value={event_date}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </label>
                </div>

                <div className="mb-4">
                  <label
                    className="input input-bordered flex items-center gap-2 text-gray-400"
                    htmlFor="location"
                  >
                    Location:
                    <input
                      id="location"
                      type="text"
                      className="grow text-black"
                      value={event_location}
                      onChange={(e) => setEventLocation(e.target.value)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 px-4 py-3 font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-400"
                >
                  Submit Event
                </button>
              </form>
            </div>

            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-4">
              <Calendar
                localizer={localizer}
                events={mappedEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '400px' }}
              />
            </div>
          </div>
        </main>
      </div>

      <dialog id="check" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Successfully added</h3>
          <p className="py-4">Event is added successfully .</p>
        </div>
      </dialog>
    </>
  );
};

export default Events;
