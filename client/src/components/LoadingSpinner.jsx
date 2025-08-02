import "../assets/styles/loadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="liquid-spinner">
        <div className="liquid-spinner-inner"></div>
      </div>
      <p className="loading-text">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;
