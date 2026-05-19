import { useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);

  const scrollHeight = () => {
    const el = document.documentElement;
    const scrollTop = el.scrollTop || document.body.scrollTop;
    const scrollHeight = el.scrollHeight || document.body.scrollHeight;
    const clientHeight = el.clientHeight;
    
    // Calculate percentage, but only if we are on a page where scrolling is possible
    const totalScrollable = scrollHeight - clientHeight;
    if (totalScrollable <= 0) {
      setWidth(0);
      return;
    }

    const scrollPercent = (scrollTop / totalScrollable) * 100;
    setWidth(scrollPercent);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeight);
    // Initial check in case page is already scrolled
    scrollHeight();
    
    return () => window.removeEventListener("scroll", scrollHeight);
  }, []);

  return (
    <div 
      className="reading-progress-container" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        zIndex: 2000,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    >
      <div 
        className="reading-progress-bar"
        style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: 'var(--bs-primary, #0d6efd)',
          transition: 'width 0.1s ease-out',
          boxShadow: '0 0 10px rgba(13, 110, 253, 0.5)'
        }}
      />
    </div>
  );
};

export default ReadingProgressBar;
