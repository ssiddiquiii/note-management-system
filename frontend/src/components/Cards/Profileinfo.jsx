import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar Circle */}
      <div className="w-10 h-10 flex items-center justify-center rounded text-[14px] text-white font-semibold bg-[var(--accent)] shadow-sm">
        {getInitials(userInfo?.fullName)}
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {userInfo?.fullName}
        </p>
        <button
          className="text-xs text-[var(--text-secondary)] underline hover:text-[var(--text-primary)] transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
