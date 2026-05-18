
const Modal = ({ show, onClose, title, children, footer }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop-custom" onClick={onClose}></div>
      <div className="modal-dialog modal-dialog-centered shadow-lg" style={{ width: '100%', maxWidth: '500px', margin: '1rem', zIndex: 1061 }}>
        <div className="modal-content border-0 rounded-4 p-3">
          <div className="modal-header border-0 pb-0 d-flex justify-content-between">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body py-4">
            {children}
          </div>
          {footer && <div className="modal-footer border-0 pt-0">{footer}</div>}
        </div>
      </div>
      <style>{`
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 1060; }
        .modal-backdrop-custom { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); }
      `}</style>
    </div>
  );
};

export default Modal;
