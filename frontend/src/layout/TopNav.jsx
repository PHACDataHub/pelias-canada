import  { useState, useEffect, useRef } from "react";
import "./TopNav.css";
import { Link, NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false); // State for toggling the main menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for toggling the dropdown menu
  const lastMenuItemRef = useRef(null); // Ref for the last menu item in the main menu
  const lastDropMenuItemRef = useRef(null); // Ref for the last menu item in the dropdown menu
  const menuRef = useRef(null); // Ref for the main menu container
  const dropdownMenuRef = useRef(null); // Ref for the dropdown menu container

  // Effect to handle body class when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll", "menu-open");
    } else {
      document.body.classList.remove("no-scroll", "menu-open");
    }
    return () => {
      document.body.classList.remove("no-scroll", "menu-open");
    };
  }, [menuOpen]);

  // Effect to handle Escape key to close the main menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Effect to handle clicks outside the dropdown menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to toggle the main menu open/close
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to toggle the dropdown menu open/close
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to handle focus out event on the main menu
  const handleFocusOut = (event) => {
    if (!menuRef.current.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  // Function to handle keydown events in the dropdown menu
  const handleKeyDownInDropdown = (event) => {
    if (event.key === "Tab" && !event.shiftKey && event.target === lastMenuItemRef.current) {
      setDropdownOpen(false);
    }
  };

  // Function to handle keydown events in the last dropdown menu item
  const handleKeyDownInDropdownMenu = (event) => {
    if (event.key === "Tab" && !event.shiftKey && event.target === lastDropMenuItemRef.current) {
      setDropdownOpen(false);
    }
  };

  // Function to close the menu when a NavLink is clicked
  const handleCloseMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav>
      <div className="body">
        {/* Main Logo/Title */}
        <Link to="/" className="title">
          Pelias Geocoder
        </Link>

        {/* Menu Toggle Button */}
        <div
          className="menu"
          onClick={handleMenuToggle}
          onKeyPress={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleMenuToggle();
            }
          }}
          role="button"
          tabIndex="0"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Main Menu Items */}
        <ul className={menuOpen ? "open" : ""} ref={menuRef} onBlur={handleFocusOut} tabIndex="-1">
          <li>
            <NavLink to="/home" tabIndex="0" className="active-exclude" onClick={handleCloseMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/bulk-input" onClick={handleCloseMenu}>
              Bulk Input
            </NavLink>
          </li>

          {/* Dropdown Menu */}
          <li className="dropdown">
            <button
              onClick={handleDropdownToggle}
              className={`dropdown-button ${dropdownOpen ? "active" : ""}`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Developers {!dropdownOpen ? (<FaAngleDown style={{size: "5px"}}/>) : (<FaAngleDown style={{size: "5px", transform: "rotateZ(180deg)", transition: 'transition: transform 0.3s;'}}/>)}
            </button>
            <ul
              ref={dropdownMenuRef} // Assign ref to dropdown menu
              className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}
              onKeyDown={handleKeyDownInDropdown}
              onBlur={() => {}} // Placeholder onBlur handler
            >
              <li>
                <NavLink to="/r-shiny-api" onClick={handleCloseMenu}>
                  R Shiny Api
                </NavLink>
              </li>
              <li>
                <NavLink to="/python-api" ref={lastDropMenuItemRef} onKeyDown={handleKeyDownInDropdownMenu} onClick={handleCloseMenu}>
                  Python Api
                </NavLink>
              </li>
            </ul>
          </li>        
        </ul>
      </div>
    </nav>
  );
}
