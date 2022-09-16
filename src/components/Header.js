import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import * as Icon from "@material-ui/icons";

function Header() {
  const history = useHistory();
  const logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  return (
    <div className="header header-nav">
      {/* <div className="sidebar">
          <NavLink to="/" className="d-block sBtn mb-3 btn py-2 btn-sm btn-light text-center">
            <p className="m-0">
              <Icon.Apps></Icon.Apps>
            </p>
            POS
          </NavLink>
          <NavLink to="/products" className="d-block sBtn mb-3 btn py-2 btn-sm btn-light text-center">
            <p className="m-0">
              <Icon.FilterNone></Icon.FilterNone>
            </p>
            Products
          </NavLink>
          <NavLink to="/sales" className="d-block sBtn mb-3 btn py-2 btn-sm btn-light text-center">
            <p className="m-0">
              <Icon.AttachMoney></Icon.AttachMoney>
            </p>
            Sales
          </NavLink>
        </div> */}

      <div className="container">
        <div className="menu py-2 d-flex flex-sm-row flex-column align-items-center justify-content-between ">
          <div>
            <button className="mr-3 d-md-none d-initial">
              <Icon.MenuSharp></Icon.MenuSharp>
            </button>
            <NavLink to="/dashboard" className="imgLink">
              <img src="/images/logo.png" height="45" alt="" className="" />
            </NavLink>
          </div>
          <div>
            <NavLink
              exact
              to="/dashboard"
              className="px-3 mr-1 pt-1 pb-2 text-white"
            >
              POS
            </NavLink>
            <span className="nav-item dropdown">
              <NavLink
                className="nav-link px-3 mr-1 pt-1 pb-2  dropdown-toggle d-inline text-white"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Products
              </NavLink>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink exact className="dropdown-item" to="/products/add">
                  + Add new product
                </NavLink>
                <NavLink exact className="dropdown-item" to="/products">
                  See products list
                </NavLink>

                <div className="dropdown-divider"></div>
                <NavLink exact className="dropdown-item" to="/categories/add">
                  + Add new category
                </NavLink>
                <NavLink exact className="dropdown-item" to="/categories">
                  See categories list
                </NavLink>
              </div>
            </span>
            <span className="nav-item dropdown">
              <NavLink
                className="nav-link px-3 mr-1 pt-1 pb-2  dropdown-toggle d-inline text-white"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Customers
              </NavLink>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink exact className="dropdown-item" to="/customers/add">
                  + Add new customer
                </NavLink>
                <NavLink exact className="dropdown-item" to="/customers">
                  See customers list
                </NavLink>
              </div>
            </span>
            <NavLink
              exact
              to="/sales"
              className="px-3 mr-1 pt-1 pb-2 text-white"
            >
              Sales
            </NavLink>
            <span className="nav-item dropdown">
              <NavLink
                className="nav-link px-3 mr-1 pt-1 pb-2  dropdown-toggle d-inline text-white"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Profile
              </NavLink>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink exact className="dropdown-item" to="/settings">
                  Settings
                </NavLink>
                <NavLink
                  exact
                  className="dropdown-item text-danger"
                  to={"/"}
                  onClick={logout}
                >
                  Logout
                </NavLink>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
