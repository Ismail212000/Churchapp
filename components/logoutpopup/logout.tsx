import React from 'react';
 
interface LogoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}
 
const LogoutPopup: React.FC<LogoutPopupProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="text-lg font-semibold mb-4">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18em" height="3em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"/></svg>
        </div>
        {/* <h1 className="text-center font-semibold">Logout</h1> */}
 
        <p className="text-gray-400 font-normal">Are you sure you want to logout now?</p>
 
        </div>
        <div className="flex justify-center space-x-4">
        <button
            onClick={onClose}
            className="bg-[#23D81E] text-gray-700 px-4 py-2 rounded hover:bg-green-700">
            Cancel
          </button>
          <button
            onClick={onLogout}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black">
            Yes,Logout
          </button>
         
        </div>
      </div>
    </div>
  );
};
 
export default LogoutPopup;