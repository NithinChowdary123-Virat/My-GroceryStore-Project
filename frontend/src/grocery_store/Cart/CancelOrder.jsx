import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

function CancelOrder({orderId, status, onCancelSuccess}){
    const cancelorder = async () => {
        // const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it!",
        });

        if (!result.isConfirmed) return;
        // if (!confirmCancel) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/grocerystore/orders/${orderId}/cancel/`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            toast.success("Order cancelled successfully",{
                    autoClose: 1000  
                });

            // call parent function to refresh data
            if (onCancelSuccess) {
                onCancelSuccess();
            }

        } catch (err) {
            console.log(err);
            // toast.error("Something went wrong Please try agian later!");
            toast.error("Failed to cancel order",{
                    autoClose: 1000  
                });
        }
    };
    return (
            <>
            {status === "placed" ? (
                <button onClick={cancelorder}
                     style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        }}
                >
                    Cancel Order
                </button>
                ) : ( <p style={{ color: "red", fontWeight: "bold" }}>CANCELLED</p> )
            }
            </>)
}
export default CancelOrder;