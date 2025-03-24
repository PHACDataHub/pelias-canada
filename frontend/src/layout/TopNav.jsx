import { useState, useEffect, useRef } from "react";
import "./TopNav.css";
import { Link, NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // State for tracking screen width
  const lastMenuItemRef = useRef(null);
  const lastDropMenuItemRef = useRef(null);
  const lastBulkDropMenuItemRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const bulkDropdownMenuRef = useRef(null);
  const { t } = useTranslation();

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        bulkDropdownMenuRef.current &&
        !bulkDropdownMenuRef.current.contains(event.target)
      ) {
        setBulkDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (screenWidth < 700) {
      setDropdownOpen(true);
    }
  }, [screenWidth]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleBulkDropdownToggle = () => {
    setBulkDropdownOpen(!bulkDropdownOpen);
  };

  const handleFocusOut = (event) => {
    if (!menuRef.current.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  const handleKeyDownInDropdown = (event) => {
    if (
      event.key === "Tab" &&
      !event.shiftKey &&
      event.target === lastMenuItemRef.current
    ) {
      setDropdownOpen(false);
    }
  };

  const handleKeyDownInDropdownMenu = (event) => {
    if (
      event.key === "Tab" &&
      !event.shiftKey &&
      event.target === lastDropMenuItemRef.current
    ) {
      setDropdownOpen(false);
    }
  };

  const handleKeyDownInBulkDropdown = (event) => {
    if (
      event.key === "Tab" &&
      !event.shiftKey &&
      event.target === lastMenuItemRef.current
    ) {
      setBulkDropdownOpen(false);
    }
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setBulkDropdownOpen(false);
  };

  return (
    <nav>
      <div className="body" style={{ zIndex: 1000 }}>
        <Link to="/" className="title">
          {t("menu.title")}
        </Link>
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
        <ul
          className={menuOpen ? "open" : ""}
          ref={menuRef}
          onBlur={handleFocusOut}
          tabIndex="-1"
        >
          <li>
            <NavLink
              to="/home"
              tabIndex="0"
              className="active-exclude"
              onClick={handleCloseMenu}
            >
              {t("menu.home")}
            </NavLink>
          </li>
          <li className="dropdown">
            <button
              onClick={handleBulkDropdownToggle}
              className={`dropdown-button ${bulkDropdownOpen ? "active" : ""}`}
              aria-expanded={bulkDropdownOpen}
              aria-haspopup="true"
              aria-label="Bulk Input menu"
            >
              {t("menu.bulkFile")}
              {!bulkDropdownOpen ? (
                <FaAngleDown style={{ size: "5px" }} />
              ) : (
                <FaAngleDown
                  style={{
                    size: "5px",
                    transform: "rotateZ(180deg)",
                    transition: "transform 0.3s",
                  }}
                />
              )}
            </button>
            <ul
              ref={bulkDropdownMenuRef}
              className={`dropdown-menu ${bulkDropdownOpen ? "open" : ""}`}
              onKeyDown={handleKeyDownInBulkDropdown}
              onBlur={() => {}}
            >
              <li>
                <NavLink to="reverse-bulk-files" onClick={handleCloseMenu}>
                  {t("menu.reverseBulkFile")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/forward-bulk-files"
                  ref={lastBulkDropMenuItemRef}
                  onClick={handleCloseMenu}
                >
                  {t("menu.addressBulkFile")}
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <button
              onClick={handleDropdownToggle}
              className={`dropdown-button ${dropdownOpen ? "active" : ""}`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="Developers menu"
            >
              {t("menu.developers")}
              {!dropdownOpen ? (
                <FaAngleDown style={{ size: "5px" }} />
              ) : (
                <FaAngleDown
                  style={{
                    size: "5px",
                    transform: "rotateZ(180deg)",
                    transition: "transform 0.3s",
                  }}
                />
              )}
            </button>
            <ul
              ref={dropdownMenuRef}
              className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}
              onKeyDown={handleKeyDownInDropdown}
              onBlur={() => {}}
            >
              <li>
                <NavLink to="/r-api" onClick={handleCloseMenu}>
                  R Api
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/python-api"
                  ref={lastDropMenuItemRef}
                  onKeyDown={handleKeyDownInDropdownMenu}
                  onClick={handleCloseMenu}
                >
                  Python Api
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink to="/contact-us" tabIndex="0" onClick={handleCloseMenu}>
              {t("menu.contactUs")}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
