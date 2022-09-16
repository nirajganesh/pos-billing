import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
const $ = window.$;

const OnHoldSales = ({
  holdItems,
  setCartItems,
  setBillDate,
  setBillNo,
  setDisc,
  setonHoldSales,
}) => {
  const history = useHistory();

  const billNow = (id) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getOnHoldSaleDetails`, {
        api_key: JSON.parse(localStorage.getItem("token")),
        id: id,
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else if (res.data.status === 404) {
          console.log("Not found: ", res.data.statusText);
        } else {
          const newData = holdItems.filter((t) => {
            return t.id != id;
          });
          setonHoldSales(newData);
          console.log(res.data.info);
          setCartItems(res.data.info.saleItems);
          setBillDate(res.data.info.sale.date);
          setBillNo(res.data.info.sale.bill_no);
          setDisc(res.data.info.sale.discount);
          $("#onHoldSales").modal("hide");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  };

  const discardBill = (v) => {
    if (window.confirm("Delete this?")) {
      axios
        .post(`${process.env.REACT_APP_SERVER_API}main/?f=deleteOnHoldSale`, {
          api_key: JSON.parse(localStorage.getItem("token")),
          id: v,
        })
        .then(function (res) {
          if (res.data.status === 401 || res.data.status === 400) {
            console.log(res.data.statusText);
            localStorage.clear();
            history.push("/");
          } else {
            const newData = holdItems.filter((t) => {
              return t.id != v;
            });
            setonHoldSales(newData);
            // alert("Product deleted");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Internal server error");
        });
    }
  };

  const discardAllBills = () => {
    if (window.confirm("Delete all On hold bills?")) {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_API}main/?f=deleteAllOnHoldSale`,
          {
            api_key: JSON.parse(localStorage.getItem("token")),
          }
        )
        .then(function (res) {
          if (res.data.status === 401 || res.data.status === 400) {
            console.log(res.data.statusText);
            localStorage.clear();
            history.push("/");
          } else {
            setonHoldSales("");
            $("#onHoldSales").modal("hide");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Internal server error");
        });
    }
  };

  return (
    <div
      className="modal"
      id="onHoldSales"
      role="dialog"
      aria-labelledby="onHoldSalesModal"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">On hold bills</h6>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
          >
            <div className="row px-2">
              {holdItems || holdItems.length || holdItems.length!='' ? (
                <div className="table-responsive">
                  <table
                    className="table table-bordered table-sm col-sm-12"
                    id="holdTable"
                    style={{ fontSize: "14px" }}
                  >
                    <thead className="thead-light">
                      <tr>
                        <th>S No.</th>
                        <th>Bill No.</th>
                        <th>Amount</th>
                        <th>Bill Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdItems.map((item, pos) => (
                        <tr key={item.id}>
                          <td>{pos + 1}.</td>
                          <td>#{item.bill_no}</td>
                          <td>₹{item.total}</td>
                          <td>
                            {("0" + new Date(item.date).getDate()).slice(-2) +
                              "-" +
                              (
                                "0" +
                                (new Date(item.date).getMonth() + 1)
                              ).slice(-2) +
                              "-" +
                              new Date(item.date).getFullYear()}
                          </td>
                          <td className="text-right">
                            <button
                              className="btn btn-outline-danger rounded-0 btn-sm mr-2"
                              onClick={() => discardBill(item.id)}
                            >
                              &times;
                            </button>
                            <button
                              className="btn btn-outline-primary rounded-0 btn-sm"
                              onClick={() => billNow(item.id)}
                            >
                              Bill now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="col-sm-12">No bills are on hold!</p>
              )}
            </div>
          </div>
          <div className="modal-footer">
          {holdItems || holdItems.length ?
            <button
              type="button"
              className="btn btn-outline-danger btn-sm rounded-0 mr-1"
              onClick={() => discardAllBills()}
            >
              &times; Delete all
            </button>: null}
            <button
              type="button"
              id="closeHoldModal"
              className="btn btn-secondary btn-sm rounded-0 px-3"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnHoldSales;
