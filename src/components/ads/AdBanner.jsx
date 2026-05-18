

const AdBanner = ({ slot, format = "auto", height = "90px", label = "Horizontal Ad Slot" }) => {
  const isProd = import.meta.env.PROD;

  return (
    <div className="ad-container bg-light rounded-4 p-3 text-center border-dashed border-2 mb-4 d-flex align-items-center justify-content-center" style={{ minHeight: height }}>
      {isProd ? (
        <ins className="adsbygoogle"
             style={{ display: "block" }}
             data-ad-client="ca-pub-YOUR_CLIENT_ID"
             data-ad-slot={slot || "YOUR_SLOT_ID"}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      ) : (
        <div>
          <span className="text-muted small fw-bold text-uppercase tracking-wider">Advertisement</span>
          <p className="text-muted small mb-0">{label}</p>
        </div>
      )}
      
      <style>{`
        .border-dashed { border-style: dashed !important; border-color: #dee2e6 !important; }
      `}</style>
    </div>
  );
};

export default AdBanner;
