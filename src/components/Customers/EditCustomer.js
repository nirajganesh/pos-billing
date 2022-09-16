import { React, useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import axios from "axios";
import ErrorMsg from "../Error/ErrorMsg";
import { useForm } from "react-hook-form";

export default function EditCustomer() {
  const history = useHistory();
  const params = useParams();

  const [Name, setName] = useState("");
  const [Contact, setContact] = useState("");
  const [Address, setAddress] = useState("");

  const submitHandler = async (data, event) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    btn.classList.add("disabled");
    btn.innerHTML = "Processing...";
    event.preventDefault();

    const formData = {
      api_key: JSON.parse(localStorage.getItem("token")),
      id: params.id,
      name: data.name,
      contact: data.contact,
      address: data.address,
    };
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=updateCustomer`, formData)
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else if (res.data.status === 409) {
          console.log(res.data);
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          alert(res.data.statusText);
        } else {
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          history.push("/customers");
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
    reset,
  } = useForm();

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=getCustomerById`, {
        api_key: JSON.parse(localStorage.getItem("token")),
        id: params.id,
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          const sData = res.data.info;
          setName(sData.name);
          setContact(sData.contact);
          setAddress(sData.address);
          reset();
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  }, [reset]);

  return (
    <div className="container">
      <h4 className="mt-4 mb-5">Edit customer</h4>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row">
          <div className="form-group col-sm-6 mb-4">
            <label>Customer contact * </label>
            <input
              defaultValue={Contact}
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

            <label>Customer name (optional) </label>
            <input
              defaultValue={Name}
              type="text"
              className="form-control"
              {...register("name", { required: false })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMsg Msg="Enter customer name"></ErrorMsg>
            )}

            <br />

            <label>Customer address (optional) </label>
            <textarea
              defaultValue={Address}
              type="text"
              maxLength="300"
              className="form-control"
              {...register("address", { required: false, maxLength: 300 })}
            ></textarea>
            {errors.address && errors.address.type === "required" && (
              <ErrorMsg Msg="Enter customer address"></ErrorMsg>
            )}
            {errors.address && errors.address.type === "maxLength" && (
              <ErrorMsg Msg="Only 300 characters allowed"></ErrorMsg>
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
          Update
        </button>
      </form>
    </div>
  );
}
