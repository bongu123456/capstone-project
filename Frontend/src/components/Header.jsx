import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass
} from "../styles/common";

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className={navbarClass}>
      <div className={navContainerClass}>
        
        {/* LOGO + BRAND */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="https://visionhospitalgoa.com/wp-content/uploads/2020/09/175-1757329_my-blog-logo-png-transparent-png.png"
            alt="logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <h2 className={navBrandClass}>BlogApp</h2>
        </NavLink>

        {/* NAV LINKS */}
        <nav>
          <ul className={navLinksClass}>
            
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? navLinkActiveClass : navLinkClass
                }
              >
                Home
              </NavLink>
            </li>

            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {currentUser?.role === "USER" && (
                  <li>
                    <NavLink
                      to="/user-profile"
                      className={({ isActive }) =>
                        isActive ? navLinkActiveClass : navLinkClass
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                )}

                {currentUser?.role === "AUTHOR" && (
                  <li>
                    <NavLink
                      to="/author-profile"
                      className={({ isActive }) =>
                        isActive ? navLinkActiveClass : navLinkClass
                      }
                    >
                      Author Profile
                    </NavLink>
                  </li>
                )}

                {currentUser && (
                  <li className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#6e6e73] font-medium hidden sm:inline">
                      Hi, {currentUser.firstName || currentUser.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-[0.8rem] text-[#ff3b30] hover:text-[#cc2f26] transition-colors font-medium cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </>
            )}

          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;