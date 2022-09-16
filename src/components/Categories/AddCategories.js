import { React } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import ErrorMsg from "../Error/ErrorMsg";
import { useForm } from "react-hook-form";

export default function AddCategories() {
  const history = useHistory();
  const submitHandler = async (data) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    btn.classList.add("disabled");
    btn.innerHTML = "Processing...";

    const form = {
      api_key: JSON.parse(localStorage.getItem("token")),
      category_name: data.name,
    };
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}categories/?f=addCategory`, form)
      .then(function (res) {
        if (res.data.status === 401 || res.data.status === 400) {
          console.log(res.data.statusText);
          localStorage.clear();
          history.push("/");
        } else {
          console.log(res.data)
          btn.classList.remove("disabled");
          btn.innerHTML = btnText;
          history.push("/categories");
          alert ('done');
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
      <h4 className="mt-4 mb-5">+ Add new category</h4>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row">
          <div className="form-group col-sm-6 mb-4">
            <label>Category name *</label>

            <input
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
