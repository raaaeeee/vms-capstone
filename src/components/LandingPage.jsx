import { useNavigate } from 'react-router-dom';
import { FaUserCog, FaUserAlt, FaClipboardList } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const navAdmin = () => navigate('/login');
  const navVisitor = () => navigate('/registration');
  const navLog = () => navigate('/visitorform');

  return (
    <div
      className="hero min-h-screen font-sans"
      style={{
        backgroundImage: 'url(./images/csu-bg.jpg)',
      }}
    >
      <div className="hero-overlay bg-opacity-80"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-xl px-4 sm:px-6 lg:px-4">
          <h1 className="mb-8 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Visitor Management System
          </h1>
          <p className="mb-8 text-sm sm:text-base lg:text-lg">
            Streamline the visitor management with exclusive online appointment
            system. Schedule and track visits effortlessly to enhance efficiency
            and improve experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center content-center gap-4 mb-3">
            <button
              className="w-full sm:w-64 btn font-medium text-white bg-green-800 rounded-lg hover:bg-green-700"
              onClick={navAdmin}
            >
              <FaUserCog className="mr-2 text-lg" />
              Admin
            </button>
            <button
              className="w-full sm:w-64 btn font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-400"
              onClick={navVisitor}
            >
              <FaUserAlt className="mr-2 text-lg" />
              Visitor
            </button>
            <button
              className="w-full sm:w-64 btn font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-700"
              onClick={navLog}
            >
              <FaClipboardList className="mr-2 text-lg" />
              Visitor Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
