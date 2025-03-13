"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment-timezone"
import "react-big-calendar/lib/css/react-big-calendar.css"
import supabase from "../supabaseClient"
import BSidebar from "./BSidebar"

const BEvents = () => {
  // State management
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    start_time: "",
    end_time: "",
    event_location: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })

    // Clear error for this field when user starts typing
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: "",
      })
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const errors = {}
    const { event_name, event_date, start_time, end_time, event_location } = formData

    if (!event_name.trim()) errors.event_name = "Event name is required"
    if (!event_date) errors.event_date = "Event date is required"
    if (!start_time) errors.start_time = "Start time is required"
    if (!end_time) errors.end_time = "End time is required"
    if (!event_location.trim()) errors.event_location = "Location is required"

    // Check if end time is after start time
    if (start_time && end_time) {
      const startDateTime = new Date(`${event_date}T${start_time}`)
      const endDateTime = new Date(`${event_date}T${end_time}`)

      if (endDateTime <= startDateTime) {
        errors.end_time = "End time must be after start time"
      }
    }

    return errors
  }

  // Add new event
  const addEvent = async () => {
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      // Format date and time for database
      const start_datetime = moment
        .tz(`${formData.event_date}T${formData.start_time}`, "YYYY-MM-DDTHH:mm", "Asia/Manila")
        .format("YYYY-MM-DD HH:mm:ss")

      const end_datetime = moment
        .tz(`${formData.event_date}T${formData.end_time}`, "YYYY-MM-DDTHH:mm", "Asia/Manila")
        .format("YYYY-MM-DD HH:mm:ss")

      // Insert event into database
      const { data, error } = await supabase.from("events").insert([
        {
          event_name: formData.event_name,
          start: start_datetime,
          end: end_datetime,
          event_date: formData.event_date,
          event_location: formData.event_location,
        },
      ])

      if (error) throw error

      // Show success message and reset form
      setSuccessMessage("Event added successfully!")
      setFormData({
        event_name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        event_location: "",
      })

      // Refresh events list
      fetchEvents()

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error adding event:", error.message)
      setErrorMessage("Failed to add event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from("events").select("*")

      if (error) throw error

      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error.message)
      setErrorMessage("Failed to load events. Please refresh the page.")
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const errors = validateForm()

    if (Object.keys(errors).length === 0) {
      addEvent()
    } else {
      setFormErrors(errors)
    }
  }

  // Format events for calendar
  const mappedEvents = events.map((event) => ({
    id: event.id,
    title: event.event_name,
    start: new Date(event.start),
    end: new Date(event.end),
    location: event.event_location,
  }))

  // Custom event component for calendar
  const EventComponent = ({ event }) => (
    <div className="text-xs p-1">
      <div className="font-semibold">{event.title}</div>
      {event.location && <div className="text-xs opacity-75">{event.location}</div>}
    </div>
  )

  // Load events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  // Calendar localizer
  const localizer = momentLocalizer(moment)

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      <BSidebar />

      <main className="flex-1 p-4 lg:p-6 ml-0 lg:ml-56 transition-all duration-300">
        <h1 className="text-2xl font-bold mb-6">Event Management</h1>

        {/* Error message */}
        {errorMessage && (
          <div className="alert alert-error mb-4 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="alert alert-success mb-4 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Event Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full lg:w-1/3">
            <div className="flex items-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold">Create New Event</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="event_name">
                  <span className="label-text font-medium">Event Name</span>
                </label>
                <input
                  id="event_name"
                  type="text"
                  placeholder="Enter event name"
                  className={`input input-bordered w-full ${formErrors.event_name ? "input-error" : ""}`}
                  value={formData.event_name}
                  onChange={handleInputChange}
                />
                {formErrors.event_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.event_name}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="event_date">
                  <span className="label-text font-medium">Event Date</span>
                </label>
                <input
                  id="event_date"
                  type="date"
                  className={`input input-bordered w-full ${formErrors.event_date ? "input-error" : ""}`}
                  value={formData.event_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                />
                {formErrors.event_date && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.event_date}</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control w-full mb-4">
                  <label className="label" htmlFor="start_time">
                    <span className="label-text font-medium">Start Time</span>
                  </label>
                  <input
                    id="start_time"
                    type="time"
                    className={`input input-bordered w-full ${formErrors.start_time ? "input-error" : ""}`}
                    value={formData.start_time}
                    onChange={handleInputChange}
                  />
                  {formErrors.start_time && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.start_time}</span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label" htmlFor="end_time">
                    <span className="label-text font-medium">End Time</span>
                  </label>
                  <input
                    id="end_time"
                    type="time"
                    className={`input input-bordered w-full ${formErrors.end_time ? "input-error" : ""}`}
                    value={formData.end_time}
                    onChange={handleInputChange}
                  />
                  {formErrors.end_time && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.end_time}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control w-full mb-6">
                <label className="label" htmlFor="event_location">
                  <span className="label-text font-medium">Location</span>
                </label>
                <input
                  id="event_location"
                  type="text"
                  placeholder="Enter event location"
                  className={`input input-bordered w-full ${formErrors.event_location ? "input-error" : ""}`}
                  value={formData.event_location}
                  onChange={handleInputChange}
                />
                {formErrors.event_location && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.event_location}</span>
                  </label>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            </form>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full lg:flex-1">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <h2 className="text-xl font-semibold">Event Calendar</h2>
            </div>

            <div className="calendar-container" style={{ height: "500px" }}>
              <Calendar
                localizer={localizer}
                events={mappedEvents}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week", "day", "agenda"]}
                components={{
                  event: EventComponent,
                }}
                popup
                tooltipAccessor={(event) => `${event.title} - ${event.location}`}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal - Using DaisyUI modal */}
      <dialog id="check" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-bold text-lg">Successfully Added</h3>
          </div>
          <p className="py-4">Your event has been added successfully to the calendar.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                OK
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <style jsx>{`
        /* Calendar custom styles */
        :global(.rbc-calendar) {
          font-family: inherit;
        }
        
        :global(.rbc-header) {
          padding: 8px;
          font-weight: 600;
          background-color: #f8f9fa;
        }
        
        :global(.rbc-event) {
          background-color: #3b82f6;
          border-radius: 4px;
        }
        
        :global(.rbc-today) {
          background-color: #eff6ff;
        }
        
        :global(.rbc-toolbar button) {
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
        
        :global(.rbc-toolbar button:hover) {
          background-color: #f3f4f6;
        }
        
        :global(.rbc-toolbar button.rbc-active) {
          background-color: #3b82f6;
          color: white;
        }
        
        :global(.rbc-toolbar-label) {
          font-weight: 600;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  )
}

export default BEvents

