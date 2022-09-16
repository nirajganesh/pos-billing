import { React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { ButtonGroup, Button } from "@material-ui/core";
import * as Icon from "@material-ui/icons";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const Products = () => {
  const history = useHistory();

  const delData = (v) => {
    if (window.confirm("Delete this data?")) {
      axios
        .post(`${process.env.REACT_APP_SERVER_API}main/?f=deleteItem`, {
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

  const toggleStock = (v, toggleTo) => {
    if (window.confirm("Change stock status?")) {
      axios
        .post(`${process.env.REACT_APP_SERVER_API}main/?f=toggleItemInStock`, {
          api_key: JSON.parse(localStorage.getItem("token")),
          id: v,
          toggle_to: toggleTo,
        })
        .then(function (res) {
          if (res.data.status === 401 || res.data.status === 400) {
            console.log(res.data.statusText);
            localStorage.clear();
            history.push("/");
          } else {
            const newData = tblData.map((t) =>
              t.id == v ? { ...t, in_stock: toggleTo } : t
            );
            settblData(newData);
            // alert("Stock status changed!");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Internal server error");
        });
    }
  };

  const editData = (v) => {
    history.push(`/products/edit/${v}`);
  };

  const [tblData, settblData] = useState([]);
  const columns = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "image",
      label: "Image",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          let src;
          value === null
            ? (src = "images/default.png")
            : (src = "images/" + value);
          return <img src={src} alt="" height="40" />;
        },
      },
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "category_name",
      label: "Category",
    },
    {
      name: "cp",
      label: "CP",
    },
    {
      name: "sp",
      label: "SP",
    },
    {
      name: "in_stock",
      label: "In stock",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return parseInt(value) === 1 ? (
            <>
              <small className="text-success">YES</small>
              <br />
              <Icon.ToggleOn
                onClick={() => toggleStock(tableMeta.rowData["0"], 0)}
                fontSize="large"
                style={{ cursor: "pointer", color: "#555" }}
              ></Icon.ToggleOn>
            </>
          ) : (
            <>
              <small className="text-danger">NO</small>
              <br />
              <Icon.ToggleOffOutlined
                onClick={() => toggleStock(tableMeta.rowData["0"], 1)}
                fontSize="large"
                style={{ cursor: "pointer", color: "#555" }}
              ></Icon.ToggleOffOutlined>
            </>
          );
        },
      },
    },
    {
      name: "id",
      label: "Actions",
      options: {
        print: false,
        filter: true,
        customBodyRender: (value) => (
          <ButtonGroup aria-label="small outlined button group">
            <Button className="text-primary" onClick={() => editData(value)}>
              <Icon.Edit style={{ fontSize: "16px" }}></Icon.Edit>
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

  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableCell: {
          root:{
            padding: "5px 5px 5px 16px",
          },
        },
      },
    });

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getAllItems`, {
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
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Products list"}
          data={tblData}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </div>
  );
};

export default Products;
