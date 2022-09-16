import { React, useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import axios from "axios";
import ErrorMsg from "../Error/ErrorMsg";
import { useForm } from "react-hook-form";
import Select from "react-select";

export default function EditProduct() {
  const history = useHistory();
  const params = useParams();
  let opt;
  const [Name, setName] = useState("");
  const [Cost, setCost] = useState();
  const [Sell, setSell] = useState();
  const [Flag, setFlag] = useState(false);

  const [CategoryId, setCategoryId] = useState(0);
  const [SelectedLabel, setSelectedLabel] = useState('');
  const [Options, setOptions] = useState([]);
  const [File, setFile] = useState();
  const [IsSelected, setIsSelected] = useState(false);
  const [OldImgFile, setOldImgFile] = useState();
  const [OldImgFilePresent, setOldImgFilePresent] = useState(false);

  const changeFileHandler = (event) => {
    setFile(event.target.files[0]);
    setIsSelected(true);
    setOldImgFilePresent(false);
  };

  const submitHandler = async (data, event) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    // btn.classList.add("disabled");
    // btn.innerHTML = "Processing...";
    event.preventDefault();

    const formData = new FormData();
    formData.append("api_key", JSON.parse(localStorage.getItem("token")));
    IsSelected && formData.append("img", File);
    formData.append("name", data.name);
    formData.append("selling_price", data.sellPrice);
    formData.append("cost_price", data.costPrice);
    formData.append("category_id", CategoryId);
    formData.append("id", params.id);
    // for (var value of formData.values()) {
    //   console.log(value);
    // }return;
    await axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=updateItem`, formData, {
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
    reset,
  } = useForm();

  useEffect(async () => {
    await axios
      .post(
        `${process.env.REACT_APP_SERVER_API}categories/?f=getAllCategories`,
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
          opt = res.data.info;
          setOptions(
            res.data.info.map((opt) => ({
              label: opt.category_name,
              value: opt.id,
            }))
          );

          axios
            .post(`${process.env.REACT_APP_SERVER_API}main/?f=getItemById`, {
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
                setCost(Number(sData.cp));
                setSell(Number(sData.sp));
                setCategoryId(sData.category_id);
                if (sData.image) {
                  setOldImgFilePresent(true);
                  setOldImgFile(sData.image);
                }
                setSelectedLabel(
                  opt.find((op) => {
                    return op.id === sData.category_id;
                  }).category_name
                );
                setFlag(true)
                reset();
              }
            })
            .catch(function (error) {
              console.log(error);
              alert("Internal server error");
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Internal server error");
      });
  }, [reset]);

  return (
    <div className="container">
      <h4 className="mt-4 mb-5">Edit product</h4>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row">
          <div className="form-group col-sm-6 mb-4">
            <label>Product name *</label>

            <input
              defaultValue={Name}
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
            {
            Flag ? (
              <Select
              className=" "
              options={Options}
              defaultValue={{label:SelectedLabel, value:CategoryId}}
              onChange={(e) => setCategoryId(e.value)}
            ></Select>
            )
            : <div>loading...</div>
          }
            
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
                defaultValue={Sell}
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
                defaultValue={Cost}
                type="number"
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
            {OldImgFilePresent ? (
              <div>
                <img
                  src={process.env.PUBLIC_URL + "/images/" + OldImgFile}
                  height="150"
                  alt=""
                />
                <br />
                <small>(Current image)</small>
              </div>
            ) : (
              <div>
                <small>(No image found for this product)</small>
              </div>
            )}
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
          Update
        </button>
      </form>
    </div>
  );
}
