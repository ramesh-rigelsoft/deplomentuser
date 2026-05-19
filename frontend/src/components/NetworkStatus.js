import React, { useEffect, useState } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMsg, setShowOnlineMsg] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      setShowOnlineMsg(true);
      setVisible(true);

      // start fade out after 1s
      setTimeout(() => {
        setVisible(false);
      }, 1000);

      // remove completely after animation
      setTimeout(() => {
        setShowOnlineMsg(false);
      }, 1500);
    };

    const goOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <>
      {/* Offline */}
      {!isOnline && (
        <div style={{ ...styles.banner, ...styles.offline }}>
          ⚠️ No Internet Connection
        </div>
      )}

      {/* Online (animated) */}
      {showOnlineMsg && (
        <div
          style={{
            ...styles.banner,
            ...styles.online,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
          }}
        >
          ✅ Back Online
        </div>
      )}
    </>
  );
};

const styles = {
  banner: {
    padding: "10px",
    textAlign: "center",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 9999,
    transition: "all 0.5s ease", // smooth animation
  },
  offline: {
    background: "red",
    color: "white",
  },
  online: {
    background: "green",
    color: "white",
  },
};

export default NetworkStatus;