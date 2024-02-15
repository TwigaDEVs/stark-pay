import React, { useState } from "react";
import "./navbar.css";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { limitChars } from "../../config/utils";
import { useAppContext } from "../../providers/AppProvider";

const Menu: React.FC = () => (
  <>
    <Link to="/items">
      {" "}
      <p>Services</p>{" "}
    </Link>
    <Link to="/my-items">
      {" "}
      <p> Chekouts</p>{" "}
    </Link>
  </>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [user, setUser] = useState(false);

  const handleLogout = () => {
    setUser(false);
  };
  const handleLogin = () => {
    setUser(true);
  };
  const {
    address,
    connection,
    handleConnetWalletBtnClick,
    contract,
    handleWalletDisconnect,
  } = useAppContext();
  const { isSmallScreen } = useAppContext();

  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
          <Link to="/">
            <h1>Stark Pay</h1>
          </Link>
        </div>
        <div className="navbar-links_container">
          <input
            type="text"
            placeholder="Search Service Here"
            autoFocus={true}
          />
          <Menu />
        </div>
      </div>
      <div className="navbar-sign">
        <>
          <button
            type="button"
            className="primary-btn"
            onClick={handleConnetWalletBtnClick}
          >
            {connection
              ? limitChars(
                  address,
                  isSmallScreen ? 5 : 10,
                  isSmallScreen ? false : true
                )
              : "Connect Wallet"}
          </button>
        </>
      </div>
      <div className="navbar-menu"></div>
    </div>
  );
};

export default Navbar;
