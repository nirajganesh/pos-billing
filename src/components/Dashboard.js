import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { React } from "react";
import Main from "./Cart/Main";
import Basket from "./Cart/Basket";
import axios from "axios";
// import data from "./data";

function App() {
  const history = useHistory();
  const directAddToBill = useRef();

  const [cartItems, setCartItems] = useState([]);
  const [MainData, setMainData] = useState([]);
  const [Data, setData] = useState([]);
  const [Categories, setCategories] = useState([])
  const [CurrentCategory, setCurrentCategory] = useState(0);
  const [Disc, setDisc] = useState(0);
  const [BillNo, setBillNo] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [Search, setSearch] = useState("");
  let d;

  const findProd = (s) => {
    setcurrentPage(1);
    setCurrentCategory(0);
    if (s === "") {
      setData(MainData);
    } else {
      d = MainData.filter(function (p) {
        return (
          p.name.toLowerCase().includes(s.toLowerCase()) || p.price.includes(s)
        );
      });
      setData(d);
    }
  };

  const changeCategory = (id) => {
    setSearch("");
    setcurrentPage(1);
    setCurrentCategory(id);
    if (id === 0) {
      setData(MainData);
    } else {
      d = MainData.filter(function (p) {
        return p.category_id === id;
      });
      setData(d);
    }
  };

  const onAdd = (product) => {
    BillNo === 0 && setBillNo(new Date().valueOf());
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: Number(exist.qty) + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
    if (document.getElementById("discount"))
      document.getElementById("discount").focus();
  };

  const onClear = () => {
    setCartItems([]);
    setDisc(0);
    setBillNo(0);
  };

  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
    if (document.getElementById("discount"))
      document.getElementById("discount").focus();
  };

  const applyDisc = (d) => {
    setDisc(d);
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getPOSItems`, {
        api_key: JSON.parse(localStorage.getItem("token")),
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          setData(res.data.info);
          setMainData(res.data.info);
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });

    axios
      .post(`${process.env.REACT_APP_SERVER_API}categories/?f=getAllCategories`, {
        api_key: JSON.parse(localStorage.getItem("token")),
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          setCategories(res.data.info);
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  }, []);

  return (
    <div className="container">
      <div className="row align-items-start mt-3">
        <Main
          directAddToBill={directAddToBill}
          products={Data}
          categories={Categories}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setcurrentPage={setcurrentPage}
          findProd={findProd}
          onAdd={onAdd}
          changeCategory={changeCategory}
          CurrentCategory={CurrentCategory}
          setCurrentCategory={setCurrentCategory}
          Search={Search}
          setSearch={setSearch}

        ></Main>
        <Basket
          directAddToBill={directAddToBill}
          products={Data}
          cartItems={cartItems}
          setCartItems={setCartItems}
          setBillNo={setBillNo}
          onAdd={onAdd}
          BillNo={BillNo}
          onRemove={onRemove}
          onClear={onClear}
          applyDisc={applyDisc}
          Disc={Disc}
          setDisc={setDisc}
        ></Basket>
      </div>
    </div>
  );
}

export default App;
