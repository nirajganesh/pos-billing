import { React, useEffect } from "react";

const CategoryBar = ({ categories, changeCategory, currentCategory }) => {
  return (
    <div className="horizontal-scrollable col-11 ml-2 mb-1 mt-2" id="horzCatg">
      <div
        className="row text-center flex-nowrap pb-2 pr-5"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <div
          onClick={() => changeCategory(0)}
          className={`col-xs-4 btn btn-sm btn-outline-primary px-4 py-1 mr-2 ${currentCategory ===0 && "active"}`}
          style={{ display: "inline-block", float: "none" }}
        >
          <small>All</small>
        </div>
        {categories.map((c) => (
          <div
            key={c.id}
            onClick={() => changeCategory(c.id)}
            className={`col-xs-4 btn btn-sm btn-outline-primary mr-2 ${currentCategory === c.id && "active"}`}
            style={{ display: "inline-block", float: "none" }}
          >
            <small>{c.category_name}</small>
          </div>
        ))}
        <div
          className="col-xs-4 mr-2"
          style={{ display: "inline-block", float: "none" }}
        >
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
