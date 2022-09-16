import { React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { ButtonGroup, Button } from "@material-ui/core";
import * as Icon from "@material-ui/icons";

const Customers = () => {
  const history = useHistory();
  const delData = (v) => {
    if (window.confirm("Delete this data?")) {
      axios
        .post(`${process.env.REACT_APP_SERVER_API}main/?f=deleteCustomer`, {
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
  const editData = (v) => {
    history.push(`/customers/edit/${v}`);
  };

  const [tblData, settblData] = useState([]);
  const columns = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "contact",
      label: "Contact",
    },
    {
      name: "address",
      label: "Adderss",
    },
    {
      name: "id",
      label: "Actions",
      options: {
        print:false,
        filter: true,
        customBodyRender: (value) => (
          <>
           
            <ButtonGroup aria-label="small outlined button group">
              <Button className="text-primary" onClick={() => editData(value)}>
                <Icon.Edit style={{ fontSize: "16px" }}></Icon.Edit>
              </Button>
              {value != 1 ?  
              <Button className="text-danger" onClick={() => delData(value)}>
                <Icon.Delete style={{ fontSize: "16px" }}></Icon.Delete>
              </Button>
              : ""}
            </ButtonGroup>
            
          </>
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
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getCustomers`, {
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
        title={"Customers List"}
        data={tblData}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default Customers;
