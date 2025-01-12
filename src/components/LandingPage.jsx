import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const navAdmin = () => {
    navigate('/login');
  };

  const navVisitor = () => {
    navigate('/registration');
  };

  
  const navLog = () => {
    navigate('/visitorform');
  };


  return (
    <>
      <div
        className="hero min-h-screen font-mono"
        style={{
          backgroundImage: 'url(./images/csu-bg.jpg)',
        }}
      >
        <div className="hero-overlay bg-opacity-80"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-lg px-4 sm:px-6 lg:px-8">
            <h1 className="mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold">
              Visitor Management System
            </h1>
            <p className="mb-5 text-sm sm:text-base lg:text-lg">
              Streamline the visitor management with exclusive online
              appointment system. Schedule and track visits effortlessly to
              enhance efficiency and improve experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center content-center gap-4 sm:gap-10 mb-3">
              <button
                className="w-full sm:w-64 px-4 py-3 font-medium text-white bg-green-800 rounded-lg hover:bg-green-700"
                onClick={navAdmin}
              >
                Admin
              </button>
              <button
                className="w-full sm:w-64 px-4 py-3 font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-400"
                onClick={navVisitor}
              >
                Visitor
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-center content-center gap-4 sm:gap-10">
              <button
                className="w-full sm:w-64 px-4 py-3 font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-700"
                onClick={navLog}
              >
               Visitor Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
