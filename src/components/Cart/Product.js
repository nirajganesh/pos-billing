import React from "react";
import * as Icon from '@material-ui/icons'

export default function Product(props) {
  const { product, onAdd } = props;
  let src
  product.image===null ? src="images/default.png" : src="images/"+product.image
  return (
    <div
      key={product.id}
      onClick={() => onAdd(product)}
      className="text-left m-2 btn col-sm-2 col-3 px-0 pt-0 pb-2 rounded-lg shadow cursor-pointer"
    >
      <img
      className="w-100 mb-2"
        alt=""
        src={src}
        height="60"
        style={{ objectFit: "cover" }}
      />
      <br />
      <small className="mb-0 px-2 text-muted"> <Icon.List style={{fontSize:"12px"}}></Icon.List> <small>{product.category_name}</small></small>
      <br />
      <small className="mb-0 px-2 font-weight-bold">₹ {product.price}</small>
      <p
        className="mb-0 px-2"
        style={{ whiteSpace: "normal", lineHeight: "16px", fontSize: "13px" }}
      >
        {product.name}
      </p>
    </div>
  );
}
