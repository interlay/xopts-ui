import { toast } from "react-toastify";

export function successToast(message: string, durationTime = 5000): void {
    toast.success(message, {
        position: "top-center",
        autoClose: durationTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
  
export function errorToast(message: string, durationTime = 5000): void {
    toast.error(message, {
        position: "top-center",
        autoClose: durationTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}