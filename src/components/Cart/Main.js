import { React, useState, useEffect, useRef } from "react";
import Product from "./Product";
import * as Icon from "@material-ui/icons";
import CategoryBar from "./CategoryBar";

export default function Main(props) {
  const {
    directAddToBill,
    products,
    onAdd,
    findProd,
    itemsPerPage,
    currentPage,
    setcurrentPage,
    categories,
    changeCategory,
    CurrentCategory,
    Search,
    setSearch,
  } = props;

  // -------------- Pagination

  const [pageNumberLimit] = useState(10);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number, pos) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={pos}
          className={currentPage === number ? "page-item active" : "page-item"}
        >
          {currentPage === number ? (
            <span className="page-link">
              {number}
              <span className="sr-only">(current)</span>
            </span>
          ) : (
            <button
              key={number}
              id={number}
              onClick={handleClick}
              className="page-link "
            >
              {number}
            </button>
          )}
        </li>
      );
    } else {
      return null;
    }
  });

  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = (
      <li onClick={handleNextbtn} className="page-item">
        {" "}
        <button className="page-link">&hellip;</button>{" "}
      </li>
    );
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = (
      <li onClick={handlePrevbtn} className="page-item">
        {" "}
        <button className="page-link">&hellip;</button>{" "}
      </li>
    );
  }

  // ------------

  const onType = (event) => {
    setSearch(event.target.value);
    findProd(event.target.value);
  };

  const srchKeyPress = (event) => {
    if (event.keyCode === 117) {
      // Press F6
      event.preventDefault();
      document.getElementById("searchField").focus();
    }
    if (event.keyCode === 113) {
      // Press F2
      directAddToBill.current.focus()
    }
    if (event.keyCode === 114) {
      //press F3
      event.preventDefault();
      if (document.getElementById("discount"))
        document.getElementById("discount").focus();
    }
    if (event.keyCode === 115) {
      //press F4
      if (!document.getElementById("cust").classList.contains("show")) {
        if (document.getElementById("checkoutBtn"))
          document.getElementById("checkoutBtn").click();
      }
    }
    if (event.keyCode === 116) {
      //press F5
      event.preventDefault();
      if (document.getElementById("cust").classList.contains("show")) {
        if (document.getElementById("finishBtn"))
          document.getElementById("finishBtn").click();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", srchKeyPress, false);
    return () => document.removeEventListener("keydown", srchKeyPress);
  }, []);

  return (
    <main className="col-sm-8 mb-2">
      {/* <h4 className="mb-0">POS billing</h4>
      <small>Click on the products to add them to the bill</small> <br />
      <br /> */}
      <div className="row">
        <div className="col-sm-12 pl-2 input-group mb-1">
          <div className="input-group-prepend">
            <span
              className="input-group-text px-2"
              id="basic-addon1"
              style={{ padding: "1px 8px", height: "auto" }}
            >
              <Icon.Search></Icon.Search>
            </span>
          </div>
            <input
              type="text"
              className="form-control"
              placeholder="Search products (Shortcut : F6)"
              value={Search}
              style={{ fontSize: "14px", padding: "3px 8px", height: "auto" }}
              id="searchField"
              onChange={onType}
              autoFocus
            />
        </div>
        {/* <div className="col-sm-6 text-right">
          <button type="button" id="fakeOnHoldBtn" className="btn btn-sm rounded-0 btn-light">
            See On-hold bills
          </button>
        </div> */}

        <CategoryBar
          categories={categories}
          currentCategory={CurrentCategory}
          changeCategory={changeCategory}
        ></CategoryBar>
        {products.length ? (
          <>
            {currentItems.map((product) => (
              <Product
                key={product.id}
                product={product}
                onAdd={onAdd}
              ></Product>
            ))}
            <small className="col-12 mt-3 mb-3 d-block">
              <strong>{products.length}</strong> product(s) found
            </small>
            <small>
              <nav className="col-12">
                {pages.length - 1 > 0 && (
                  <ul className="pagination col-12">
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={handlePrevbtn}
                        disabled={currentPage === pages[0] ? true : false}
                      >
                        Prev
                      </button>
                    </li>
                    {pageDecrementBtn}
                    {renderPageNumbers}
                    {pageIncrementBtn}

                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={handleNextbtn}
                        disabled={
                          currentPage === pages[pages.length - 1] ? true : false
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                )}
              </nav>
            </small>
          </>
        ) : (
          "No products found"
        )}
      </div>
    </main>
  );
}
