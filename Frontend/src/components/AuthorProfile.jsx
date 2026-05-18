import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";
import {
  pageWrapper,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common";

function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className={pageWrapper}>
      
      {/* Author Profile Header */}
      {currentUser && (
        <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#e8e8ed]">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.profileImageUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-1-5.48-2.67C7.62 16.27 9.66 15 12 15s4.38 1.27 5.48 2.33C16.43 19 14.03 20 12 20z'/></svg>"}
              alt="profile"
              className="w-14 h-14 rounded-full object-cover border border-[#d2d2d7]"
            />
            <div>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Welcome, {currentUser.firstName}
              </h2>
              <span className="inline-block bg-[#0066cc]/10 text-[#0066cc] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full mt-1">
                Author
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/10 font-semibold px-5 py-2 rounded-full transition-colors cursor-pointer text-xs tracking-tight"
          >
            Logout
          </button>
        </div>
      )}

      {/* Author Navigation */}
      <div className="flex gap-6 mb-6">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* Nested route content */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;