import { React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { ButtonGroup, Button } from "@material-ui/core";
import * as Icon from "@material-ui/icons";
import SaleDetails from './SalesDetails'
const $ = window.$

const Sales = () => {
  const history = useHistory();
  const delData = (v) => {
    if (window.confirm("Delete this data?")) {
      axios
        .post(`${process.env.REACT_APP_SERVER_API}main/?f=deleteSale`, {
          api_key: JSON.parse(localStorage.getItem("token")),
          id: v,
        })
        .then(function (res) {
          if (res.data.status === 401 || res.data.status === 400) {
            console.log(res.data.statusText);
            localStorage.clear();
            history.push("/");
          } else {
            const newData = tblData.filter((t) => {
              return t.id != v;
            });
            settblData(newData);
            // alert("Product deleted");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Internal server error");
        });
    }
};

const [BillData, setBillData] = useState()


  const showData = async (v) => {
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getSaleDetails`, {
        api_key: JSON.parse(localStorage.getItem("token")),
        id:v
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          setBillData(res.data.info)
          $("#details").modal("toggle");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      })
      
  };

  const [tblData, settblData] = useState([]);
  const columns = [
    {
      name: "bill_no",
      label: "Bill no.",
    },
    {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const t = value.split(/[- :]/);
          var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
          return (
            <span>
              {("0" + d.getDate()).slice(-2) +
                "-" +
                ("0" + (d.getMonth() + 1)).slice(-2) +
                "-" +
                d.getFullYear()}
            </span>
          );
        },
      },
    },
    {
      name: "contact",
      label: "Contact",
      options: { display: "excluded" },
    },
    {
      name: "name",
      label: "Customer",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <>
            <small>{value}</small>
            <br />
            <small>({tableMeta.rowData["2"]})</small>
          </>
        ),
      },
    },
    {
      name: "total",
      label: "Paid",
      options: {
        filter: true,
        customBodyRender: (value) => (
          <p>₹ {value}</p>
        ),
      },
    },
    {
      name: "id",
      label: "Actions",
      options: {
        print:false,
        filter: true,
        customBodyRender: (value) => (
          <ButtonGroup aria-label="small outlined button group">
            <Button className="text-primary" onClick={() => showData(value)}>
              <Icon.Visibility style={{ fontSize: "16px" }}></Icon.Visibility>
            </Button>
            <Button className="text-danger" onClick={() => delData(value)}>
              <Icon.Delete style={{ fontSize: "16px" }}></Icon.Delete>
            </Button>
          </ButtonGroup>
        ),
      },
    },
  ];

  const options = {
    filterType: "textField",
    jumpToPage: true,
    download: false,
    responsive: "standard",
    selectToolbarPlacement: "above",
    selectableRows: "multiple",
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getAllSales`, {
        api_key: JSON.parse(localStorage.getItem("token")),
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          settblData(res.data.info);
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  }, []);

  return (
    <div className="container mt-5">
      <MUIDataTable
        title={"Sales"}
        data={tblData}
        columns={columns}
        options={options}
      />
      <SaleDetails data={BillData}></SaleDetails>
    </div>
  );
};

export default Sales;
