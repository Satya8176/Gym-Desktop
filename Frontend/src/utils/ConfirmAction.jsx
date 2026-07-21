import toast from "react-hot-toast";

export const confirmAction = (message = "Are you sure?") => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div
          style={{
            background: "#b6dbfe",
            border: "1px solid #18079a",
            borderRadius: "14px",
            padding: "18px 20px",
            width: "420px",
            maxWidth: "90vw",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            fontFamily: "system-ui",
          }}
        >
          {/* Message */}
          <p
            style={{
              color: "#1f2937",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "14px",
            }}
          >
            {message}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            
            {/* Cancel */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              style={{
                background: "#50ff6a",
                color: "#374151",
                border: "1px solid #07aa07",
                padding: "7px 14px",
                borderRadius: "7px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              style={{
                background: "#ef4444",
                color: "#ffffff",
                border: "1px solid #dc2626",
                padding: "7px 16px",
                borderRadius: "7px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "transparent",
          boxShadow: "none",
        },
        onClose: () => resolve(false),
      }
    );
  });
};