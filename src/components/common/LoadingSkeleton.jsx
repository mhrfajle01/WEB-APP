

const LoadingSkeleton = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card border-0 mb-4 bg-transparent">
              <div className="skeleton rounded mb-3" style={{ height: "300px", width: "100%", backgroundColor: "#e9ecef" }}></div>
              <div className="card-body p-0">
                <div className="skeleton rounded mb-2" style={{ height: "32px", width: "70%", backgroundColor: "#e9ecef" }}></div>
                <div className="skeleton rounded mb-3" style={{ height: "16px", width: "40%", backgroundColor: "#e9ecef" }}></div>
                <div className="skeleton rounded mb-2" style={{ height: "16px", width: "100%", backgroundColor: "#e9ecef" }}></div>
                <div className="skeleton rounded" style={{ height: "16px", width: "100%", backgroundColor: "#e9ecef" }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card border-0 mb-4 p-4 shadow-sm">
            <div className="skeleton rounded mb-3" style={{ height: "24px", width: "50%", backgroundColor: "#e9ecef" }}></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton rounded mb-2" style={{ height: "16px", width: "100%", backgroundColor: "#e9ecef" }}></div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .skeleton {
          background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;
