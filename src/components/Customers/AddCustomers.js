import { React, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import ErrorMsg from "../Error/ErrorMsg";
import { useForm } from "react-hook-form";

export default function AddCustomers(props) {
  const history = useHistory();

  const submitHandler = async (data, event) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    btn.classList.add("disabled");
    btn.innerHTML = "Processing...";
    event.preventDefault();

    const form = {
      api_key: JSON.parse(localStorage.getItem("token")),
      name: data.name,
      contact: data.contact,
      address: data.address,
    };
    // console.log(form);
    // return;
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=addCustomer`, form)
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        }
        else if (res.data.status === 409) {
            console.log(res.data);
            btn.classList.remove("disabled");
            btn.innerHTML = btnText;
            alert(res.data.statusText);
        }
         else {
          console.log(res.data);
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          history.push("/customers");
          alert("done");
        }
      })
      .catch(function (error) {
        btn.classList.remove("disabled");
        btn.innerHTML = btnText;
        console.log(error);
        alert("Internal server error");
      });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <div className="container">
      <h4 className="mt-4 mb-5">+ Add new customer</h4>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Customer contact no. *</label>
            <input
              x-moz-errormessage="Enter Contact no. here"
              pattern="[6-9]{1}[0-9]{9}"
              minLength="10"
              maxLength="10"
              title="Enter 10 digit mobile no. starting with 6,7,8, or 9"
              placeholder="10 digit contact no."
              pattern="\d*"
              type="text"
              className="form-control"
              {...register("contact", { required: true, maxLength: 10 })}
            />
            {errors.contact && errors.contact.type === "required" && (
              <ErrorMsg Msg="Enter contact number"></ErrorMsg>
            )}
            {errors.contact && errors.contact.type === "maxLength" && (
              <ErrorMsg Msg="Number should be of max 10 digit"></ErrorMsg>
            )}
            <br />
            <label>Customer name (optional)</label>
            <input
              type="text"
              className="form-control"
              {...register("name", { required: false })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMsg Msg="Enter name"></ErrorMsg>
            )}
            <br />
            <label>Customer address (optional)</label>
            <textarea
              type="text"
              maxLength="300"
              className="form-control"
              cols="5"
              rows="3"
              {...register("address", { required: false, maxLength: 300 })}
            ></textarea>
            {errors.name && errors.name.type === "required" && (
              <ErrorMsg Msg="Enter address"></ErrorMsg>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <ErrorMsg Msg="Max 300 characters"></ErrorMsg>
            )}
          </div>
        </div>
        <Link
          to="/customers"
          className="btn btn-sm btn-outline-secondary rounded-0 mb-5 mr-3"
        >
          {" "}
          Cancel
        </Link>
        <button
          type="submit"
          id="submit"
          className="btn btn-sm rounded-0 btn-primary mb-5 px-5"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
