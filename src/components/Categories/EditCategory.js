import { React, useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import axios from "axios";
import ErrorMsg from "../Error/ErrorMsg";
import { useForm } from "react-hook-form";

export default function EditCategory() {
  const history = useHistory();
  const params = useParams();

  const [Name, setName] = useState("");

  const submitHandler = async (data, event) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    event.preventDefault();
    const formData = {
      api_key: JSON.parse(localStorage.getItem("token")),
      id: params.id,
      category_name: data.name,
    };
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}categories/?f=updateCategory`, formData)
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          history.push("/categories");
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
    handleSubmit, reset
  } = useForm();

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}categories/?f=getCategoryById`, {
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
          setName(sData.category_name);
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
      <h4 className="mt-4 mb-5">Edit category</h4>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row">
          <div className="form-group col-sm-6 mb-4">
            <label>Category name *</label>

            <input
              defaultValue={Name}
              type="text"
              className="form-control"
              {...register("name", { required: true })}
            />
            {errors.name && errors.name.type === "required" && (
              <ErrorMsg Msg="Enter category name"></ErrorMsg>
            )}
          </div>
        </div>
        <Link
          to="/categories"
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
