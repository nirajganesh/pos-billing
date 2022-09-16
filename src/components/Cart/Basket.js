import { React, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import OnHoldSales from "./OnHoldSales";
import * as Icon from '@material-ui/icons'
const $ = window.$;

export default function Basket(props) {
  const history = useHistory();
  const searchCust = useRef(null);
  let searchedNo;

  const {
    directAddToBill,
    products,
    cartItems,
    setCartItems,
    onAdd,
    onRemove,
    onClear,
    Disc,
    applyDisc,
    BillNo,
    setBillNo,
    setDisc,
  } = props;

  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const taxPrice = Math.round(itemsPrice * 0.14);
  const totalPrice = itemsPrice + taxPrice - Disc;
  var today = new Date();

  const [billDate, setBillDate] = useState(
    today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2)
  );
  const [Customers, setCustomers] = useState([
    { id: "1", name: "Walk-in", contact: "0000000000" },
  ]);
  const [CustomerId, setCustomerId] = useState(1);
  const [CustomerName, setCustomerName] = useState("Walk-in");
  const [NewCustomerCheck, setNewCustomerCheck] = useState(false);
  const [NewCustomerName, setNewCustomerName] = useState("");
  const [NewCustomerContact, setNewCustomerContact] = useState("");
  const [FormValid, setFormValid] = useState(true);
  const [onHoldSales, setonHoldSales] = useState("");

  const custInfo = (data) => {
    setCustomerId(data.value);
    setCustomerName(data.label);
  };

  const addItem = (data) => {
    onAdd(data.value);
  };

  const storeSearchedNumber = (data) => {
    if (data) {
      searchedNo = "";
      searchedNo = data;
    }
  };

  const newCust = () => {
    setNewCustomerName("");
    setNewCustomerContact("");
    if (document.getElementById("newCustCheck").checked) {
      setFormValid(false);
      setNewCustomerCheck(true);
      document.getElementById("newCustForm").style.display = "block";
      document.getElementById("oldCustList").style.display = "none";
      if (searchedNo && Number(searchedNo))
        setNewCustomerContact(Number(searchedNo));
      document.getElementById("newCustContact").focus();
    } else {
      setFormValid(true);
      setNewCustomerCheck(false);
      document.getElementById("newCustForm").style.display = "none";
      document.getElementById("oldCustList").style.display = "block";
      searchCust.current.focus();
    }
  };

  const selectCustomer = () => {
    document.getElementById("checkoutBtn").innerHTML = "Processing...";

    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getCustomers`, {
        api_key: JSON.parse(localStorage.getItem("token")),
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          document.getElementById("checkoutBtn").innerHTML = "Checkout";
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          setCustomers(res.data.info);
          $("#cust").modal("show");
          searchCust.current.focus();
        }
      })
      .catch(function (error) {
        document.getElementById("checkoutBtn").innerHTML = "Checkout";
        console.log(error);
        alert("Internal server error");
      });

    $("#cust").on("hidden.bs.modal", function () {
      document.getElementById("checkoutBtn").innerHTML = "Checkout";
    });
  };

  const Checkout = () => {
    document.getElementById("checkoutBtn").innerHTML = "Checkout";
    let payload;
    if (NewCustomerCheck) {
      payload = {
        newCust: NewCustomerCheck,
        newCustName: NewCustomerName,
        newCustContact: NewCustomerContact,
        api_key: JSON.parse(localStorage.getItem("token")),
        bill_no: BillNo,
        sub_total: itemsPrice,
        tax: taxPrice,
        discount: Disc,
        total: totalPrice,
        date: billDate,
        items: cartItems,
      };
    } else {
      payload = {
        newCust: NewCustomerCheck,
        api_key: JSON.parse(localStorage.getItem("token")),
        bill_no: BillNo,
        customer_id: CustomerId,
        sub_total: itemsPrice,
        tax: taxPrice,
        discount: Disc,
        total: totalPrice,
        date: billDate,
        items: cartItems,
      };
    }

    // console.log(payload);return;

    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=addSale`, payload)
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else if (res.data.status === 200) {
          setBillDate(
            today.getFullYear() +
              "-" +
              ("0" + (today.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + today.getDate()).slice(-2)
          );
          document.getElementById("newCustCheck").checked = false;
          newCust();
          onClear();
          PrintBill();
        } else {
          console.log(res.data);
          alert("Unknown error");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });

    $("#cust").modal("toggle");
  };

  const PrintBill = () => {
    var a = window.open("", "", "height=500, width=1000");
    let billContent = `
      <html>
      <title>Bill - ${BillNo}</title>
      <head>
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
       <style>
       *{
        font-family: 'monospace', monospace;
       }
        p{font-size:12px !important;margin:0}
       </style>
      </head>
        <body>
          <div class="print px-2 py-1" style="max-width:80mm !important; border:1px dashed #555">

           <div class="top text-center">
              <img src="${
                window.location.origin
              }/images/logo.png" class="mb-1" alt="" height="40" />
              <h6 class="mb-1">DKS POS</h6>
              <p><small>C-121, Budhapara, Raipur (CG)</small></p>
              <p><small>Mob - 9021073372</small></p>
           </div>

           <div class="info my-2 pb-2" style="border-bottom:2px dashed #999">
            <p>Customer: ${
              NewCustomerCheck
                ? NewCustomerName + " (" + NewCustomerContact + ")"
                : CustomerName
            }</p>
            <p class="d-flex justify-content-between">
              <span>Bill: #${BillNo} </span> 
              <span>Date: ${
                ("0" + new Date(billDate).getDate()).slice(-2) +
                "-" +
                ("0" + (new Date(billDate).getMonth() + 1)).slice(-2) +
                "-" +
                new Date(billDate).getFullYear()
              }
              </span> 
            </p>
           </div>

           <div class="items mb-2 pb-2" style="border-bottom:2px dashed #999">
            ${cartItems
              .map(
                (c) =>
                  `<p style="font-weight:bold">` +
                  c.name +
                  `</p>
                <div class="d-flex justify-content-between">
                  <p>` +
                  c.qty +
                  ` x ₹` +
                  c.price +
                  `</p>
                  <p style="font-weight:bold">₹` +
                  c.qty * c.price +
                  `</p>
                </div>`
              )
              .join('<span class="my-2 d-block"></span>')}
           </div>

           <div class="totals">
            <div class="d-flex justify-content-between">
              <p>Sub-total:</p>
              <p class="text-right">₹${itemsPrice.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-between">
              <p>Tax:</p>
              <p class="text-right">₹${taxPrice.toFixed(2)}</p>
            </div>
            ${
              Disc > 0
                ? `
              <div class="d-flex justify-content-between">
                <p>Discount:</p>
                <p class="text-right">(-) ₹` +
                  parseInt(Disc).toFixed(2) +
                  `</p>
              </div>`
                : ""
            }
            <div class="d-flex justify-content-between py-1 my-2" style="border-top:2px dashed #999;border-bottom:2px dashed #999">
              <p style="font-weight:bold" class="">TOTAL:</p>
              <p class="text-right" style="font-weight:bold">₹${totalPrice.toFixed(
                2
              )}</p>
            </div>
           </div>

           <div class="footer text-center mt-2">
            <p><small>*&nbsp; THANK YOU. VISIT AGAIN &nbsp;*</small></p>
           </div>


          </div>
        </body>
      </html>
      `;
    a.document.write(billContent);
    a.document.close();
    a.print();
    a.onafterprint = function () {
      a.close();
    };
  };

  const ShowOnHoldBills = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getAllOnHoldSales`, {
        api_key: JSON.parse(localStorage.getItem("token")),
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else if (res.data.status === 404) {
          console.log("Not found: ", res.data.statusText);
        } else {
          setonHoldSales(res.data.info);
          $("#onHoldSales").modal("show");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
    $("#onHoldSales").modal("show");
  };

  const AddOnHold = () => {
    let payload1 = {
      api_key: JSON.parse(localStorage.getItem("token")),
      bill_no: BillNo,
      sub_total: itemsPrice,
      tax: taxPrice,
      discount: Disc,
      total: totalPrice,
      date: billDate,
      items: cartItems,
    };

    axios
      .post(
        `${process.env.REACT_APP_SERVER_API}main/?f=addOnHoldSale`,
        payload1
      )
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else if (res.data.status === 200) {
          setBillDate(
            today.getFullYear() +
              "-" +
              ("0" + (today.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + today.getDate()).slice(-2)
          );
          onClear();
        } else {
          console.log(res.data);
          alert("Unknown error");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  };

  useEffect(() => {
    if (NewCustomerCheck) {
      if (NewCustomerContact.length === 10) {
        setFormValid(true);
      } else {
        setFormValid(false);
      }
    }
  }, [NewCustomerContact]);

  return (
    <div className="col-sm-4">
      <div className="row bill-items">
        <div className="col-12">
          <small>
            <Select
              id="billItems"
              ref={directAddToBill}
              placeholder="Select products (Shortcut: F2)"
              className="mb-2"
              onChange={(d) => addItem(d)}
              options={products.map((opt) => ({
                label: opt.name + " -- Rs. " + opt.price + " -- Id: " + opt.id,
                value: opt,
              }))}
            ></Select>
          </small>
        </div>
      </div>
      <aside
        className="bg-light pl-2 py-2"
        style={{ border: "1px dashed #000", minHeight: "70vh" }}
      >
        <div className="row bill-date pr-2">
          <div className="col-md-5">
            <small>
              <div className="dropdown">
                <a
                  className="btn btn-sm dropdown-toggle d-flex pl-0 align-items-center"
                  id="dropdownMenu2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                ><small>Options</small></a>
                <div className="dropdown-menu py-0 " aria-labelledby="dropdownMenu2">
                  <a
                    className="btn btn-sm btn-light dropdown-item"
                    onClick={() => ShowOnHoldBills()}
                    id="realOnHoldBtn"
                    type="button"
                  >
                    <small>See On-hold bills</small>
                  </a>
                </div>
              </div>
            </small>
          </div>
          <div className="col-md-7 text-right">
            <input
              type="date"
              className="form-control pr-1"
              style={{ height: "28px", fontSize: "14px" }}
              onChange={(e) => setBillDate(e.target.value)}
              value={billDate}
            />
          </div>
        </div>

        <div className="d-flex bill-no justify-content-between pb-1 pr-2 mb-3 border-bottom">
          {cartItems.length !== 0 && <small className="m-0 p-0 pl-0">Bill #{BillNo}</small>}
          {cartItems.length !== 0 && (
            <small>
              <p
                onClick={() => onClear()}
                className="text-danger text-right m-0 p-0"
                style={{ cursor: "pointer" }}
              >
                &times; clear bill
              </p>
            </small>
          )}
        </div>

        <div className="bill-items">
          <div class="billItemContainer pr-2" style={{height:"45vh", overflow: "hidden", overflowY: "scroll"}}>
          {cartItems.length === 0 && (
            <small className="d-block">
              Click on products to start billing
            </small>
          )}
          {cartItems.slice(0).reverse().map((item) => (
            <div key={item.id}>
              <div className="row">
                <div className="col-6">
                  <small className="mb-0 d-block">{item.name}</small>
                  <small>
                  <small><strong>₹ {item.price}</strong></small>
                  </small>
                </div>
                <div className="col px-0">
                  <small>
                  <button
                    onClick={() => onRemove(item)}
                    className="btn rounded-0 btn-sm px-1 pt-0 pb-2 btn-outline-secondary"
                    style={{ width: "27px", height: "20px", fontSize: "22px", lineHeight: "0px", fontWeight:"bold" }}
                  >
                    -
                  </button>
                  &nbsp; {item.qty} &nbsp;
                  <button
                    onClick={() => onAdd(item)}
                    className="btn rounded-0  btn-sm btn-outline-secondary pb-2 px-2"
                    style={{ width: "27px", height: "20px", fontSize: "15px", lineHeight: "0px", fontWeight:"bold" }}
                  > +
                  </button>
                  </small>
                </div>

                <div className="col-3 text-right">
                  <small className="font-weight-bold">₹ {item.qty * parseInt(item.price).toFixed(2)}</small>
                </div>
              </div>
              <hr className="my-0 mb-1 pr-2" />
            </div>
          ))}
          </div>

          {cartItems.length !== 0 && (
            <>
              <hr className="mt-0 mb-1 border border-secondary mr-2" />
              <div className="row pr-2">
                <div className="col-7"><small>Sub-total:</small></div>
                <div className="col-5 text-right">
                  <small>₹ {itemsPrice.toFixed(2)}</small>
                </div>
              </div>
              <div className="row pr-2">
                <div className="col-7"><small>Tax:</small></div>
                <div className="col-5 text-right"><small>₹ {taxPrice.toFixed(2)}</small></div>
              </div>
              <div className="row pr-2">
                <div className="col-7"><small>Discount:</small></div>
                <div className="col-5 text-right">
                  <small>
                    <input
                      type="number"
                      style={{height: "1.5rem", fontSize: "13px" }}
                      className="form-control text-right p-0 pr-1"
                      value={Disc}
                      min="0"
                      id="discount"
                      onChange={(e) => applyDisc(e.target.value)}
                    />
                  </small>
                </div>
              </div>

              <div className="row pr-2">
                <div className="col-5">
                  <small><strong>Total:</strong></small>
                </div>
                <div className="col-7 text-right">
                  <small><strong>₹ {totalPrice.toFixed(2)}</strong></small>
                </div>
              </div>
              <hr className="border mt-1 mb-2 border-secondary mr-2" />
              <div className="row pr-2">
                <div className="col-4">
                  <button
                    title="Put this bill on hold"
                    className="btn d-flex align-items-center bg-light btn-sm text-info rounded-0"
                    onClick={() => AddOnHold()}
                  >
                    <Icon.PanTool className="mr-1" style={{fontSize:"12px"}}> </Icon.PanTool> Hold
                  </button>
                </div>
                <div className="col-sm-8 text-right">
                  {/* <button
                    type="button"
                    title="Print KOT"
                    className="btn mr-1 btn-sm btn-outline-primary rounded-0"
                    onClick={() => PrintBill()}
                  >
                    <Icon.Print style={{fontSize:"16px"}}></Icon.Print> KOT
                  </button> */}
                  <button
                    type="button"
                    title="Checkout & Print Bill"
                    id="checkoutBtn"
                    // data-toggle="modal"
                    // data-target="#cust"
                    className="btn btn-sm px-4 btn-primary rounded-0"
                    onClick={() => selectCustomer()}
                  >
                    Checkout
                  </button>
                  
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="modal"
          id="cust"
          role="dialog"
          aria-labelledby="customerModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose customer</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <small>
                  <Select
                    className="mb-2"
                    onChange={(d) => custInfo(d)}
                    onInputChange={(f) => storeSearchedNumber(f)}
                    id="oldCustList"
                    ref={searchCust}
                    options={Customers.map((opt) => ({
                      label: opt.name + " (" + opt.contact + ")",
                      value: opt.id,
                    }))}
                  ></Select>
                </small>
                <small>
                  <span className="">
                    <input
                      type="checkbox"
                      id="newCustCheck"
                      className="mr-1"
                      onChange={() => newCust()}
                    />
                    <label htmlFor="newCustCheck"> Add new customer?</label>
                  </span>
                </small>
                <br />
                <div className="" style={{ display: "none" }} id="newCustForm">
                  <input
                    type="text"
                    className="form-control my-2"
                    placeholder="New customer name (optional)"
                    maxLength="20"
                    value={NewCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    id="newCustContact"
                    max="9999999999"
                    placeholder="10 digit Contact no. *"
                    maxLength="10"
                    value={NewCustomerContact}
                    onChange={(e) => setNewCustomerContact(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="closeModal"
                  className="btn btn-secondary btn-sm rounded-0"
                  data-dismiss="modal"
                >
                  cancel
                </button>
                <button
                  type="button"
                  id="finishBtn"
                  className="btn btn-primary btn-sm rounded-0"
                  disabled={!FormValid}
                  onClick={() => Checkout()}
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>

        <OnHoldSales
          holdItems={onHoldSales}
          setCartItems={setCartItems}
          setBillDate={setBillDate}
          setBillNo={setBillNo}
          setDisc={setDisc}
          setonHoldSales={setonHoldSales}
        ></OnHoldSales>
      </aside>
    </div>
  );
}
