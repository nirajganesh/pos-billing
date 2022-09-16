import { React, useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import ErrorMsg from "../Error/ErrorMsg";
import { useForm } from "react-hook-form";
import Select from "react-select";

export default function AddProducts(props) {
  const history = useHistory();

  const [CategoryId, setCategoryId] = useState(0);
  const [File, setFile] = useState();
  const [IsSelected, setIsSelected] = useState(false);
  const [CategoryValid, setCategoryValid] = useState(true);
  const [Options, setOptions] = useState([])

  const changeFileHandler = (event) => {
    setFile(event.target.files[0]);
    setIsSelected(true);
  };

  const submitHandler = async (data) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    btn.classList.add("disabled");
    btn.innerHTML = "Processing...";
    // event.preventDefault();
    if (CategoryId === 0) {
      setCategoryValid(false);
      return;
    } else {
      setCategoryValid(true);
    }

    const formData = new FormData();
    formData.append("api_key", JSON.parse(localStorage.getItem("token")));
    formData.append("img", File);
    formData.append("name", data.name);
    formData.append("category_id", CategoryId);
    formData.append("selling_price", data.sellPrice);
    formData.append("cost_price", data.costPrice);
    formData.append("category_id", CategoryId);
    // for (var value of formData.values()) {
    //   console.log(value);
    // }return;
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=addItem`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else if (res.data.status === 500){
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          alert("Error uploading the image");
        } else if (res.data.status === 200){
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          history.push("/products");
          alert("done");
        } else {
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          alert("Internal server error");
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

  useEffect( async () => {
   await axios
      .post(`${process.env.REACT_APP_SERVER_API}categories/?f=getAllCategories`, {
        api_key: JSON.parse(localStorage.getItem("token")),
      })
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          setOptions(res.data.info);
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  }, []);

  return (
    <div className="container">
      <h4 className="mt-4 mb-5">+ Add new product</h4>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row">
          <div className="form-group col-sm-6 mb-4">
            <label>Product name *</label>

            <input
              type="text"
              className="form-control"
              {...register("name", { required: true })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMsg Msg="Enter product name"></ErrorMsg>
            )}
          </div>

          <div className="form-group col-sm-6 mb-4">
            <label>Product category *</label>
            <Select
              className=" "
              options={Options.map((opt) => ({
                label: opt.category_name,
                value: opt.id,
              }))}
              onChange={(e) => {
                setCategoryId(e.value);
                setCategoryValid(true);
              }}
            ></Select>
            {!CategoryValid && (
              <ErrorMsg Msg="Select category"></ErrorMsg>
            )}
          </div>

          <div className="form-group col-sm-6 mb-4">
            <label>Product selling price *</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <strong>₹</strong>
                </span>
              </div>
              <input
                type="number"
                className="form-control"
                {...register("sellPrice", { required: true })}
              />
            </div>
            {errors.sellPrice && errors.sellPrice.type === "required" && (
              <ErrorMsg Msg="Enter selling price"></ErrorMsg>
            )}
          </div>

          <div className="form-group col-sm-6 mb-4">
            <label>Product cost price (optional)</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <strong>₹</strong>
                </span>
              </div>
              <input
                type="number"
                defaultValue="0"
                className="form-control"
                {...register("costPrice", { required: false })}
              />
            </div>
          </div>

          <div className="form-group col-sm-6 mb-4">
            <label>Product image (optional)</label>
            <input
              accept=".jpg, .jpeg, .bmp, .png, .svg"
              type="file"
              className="form-control border-0"
              onChange={(e) => changeFileHandler(e)}
            />
            <br />
            {IsSelected ? (
              <div>
                <img src={URL.createObjectURL(File)} height="150" alt="" />
              </div>
            ) : null}
          </div>
        </div>
        <Link
          to="/products"
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
