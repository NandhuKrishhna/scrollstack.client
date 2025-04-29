import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
    return (
        <Toaster
            toastOptions={{
                style: {
                    background: "#27272a",
                    color: "#ffffff",
                    border: "1px solid #3f3f46",
                    padding: "12px",
                    borderRadius: "20px",
                },
                success: {
                    iconTheme: {
                        primary: "#22c55e",
                        secondary: "#ffffff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                },
            }}
        />
    );
};

export default CustomToaster;
