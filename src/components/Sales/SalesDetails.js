import React from "react";

const SaleDetails = ({ data }) => {
  let sale, saleItems, date;
  if (data) {
    sale = data.sale;
    saleItems = data.saleItems;
    const t = data.sale.date.split(/[- :]/);
    var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    date =
      ("0" + d.getDate()).slice(-2) +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      d.getFullYear();
  }

  const PrintBill = () => {
    var a = window.open("", "", "height=500, width=1000");
    let billContent = `
      <html>
      <title>Bill - ${sale && sale.bill_no}</title>
      <head>
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
       <style>
       *{
        font-family: 'monospace', monospace;
       }
        p{font-size:12px !important;margin:0}
       </style>
      </head>
        <body>
          <div class="print px-2 py-1" style="max-width:80mm !important; border:1px dashed #555">

           <div class="top text-center">
              <img src="${
                window.location.origin
              }/images/logo.png" class="mb-1" alt="" height="40" />
              <h6 class="mb-1">DKS POS</h6>
              <p><small>C-121, Budhapara, Raipur (CG)</small></p>
              <p><small>Mob - 9021073372</small></p>
           </div>

           <div class="info my-2 pb-2" style="border-bottom:2px dashed #999">
            <p>Customer: ${sale && sale.name} (${sale && sale.contact})</p>
            <p class="d-flex justify-content-between">
              <span>Bill: #${sale && sale.bill_no} </span> 
              <span>Date: ${sale && date}
              </span> 
            </p>
           </div>

           <div class="items mb-2 pb-2" style="border-bottom:2px dashed #999">
            ${
              saleItems &&
              saleItems
                .map(
                  (c) =>
                    `<p style="font-weight:bold">` +
                    c.name +
                    `</p>
                <div class="d-flex justify-content-between">
                  <p>` +
                    c.qty +
                    ` x ₹` +
                    c.selling_price +
                    `</p>
                  <p style="font-weight:bold">₹` +
                    c.qty * c.selling_price +
                    `</p>
                </div>`
                )
                .join('<span class="my-2 d-block"></span>')
            }
           </div>

           <div class="totals">
            <div class="d-flex justify-content-between">
              <p>Sub-total:</p>
              <p class="text-right">₹${sale && parseInt(sale.sub_total).toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-between">
              <p>Tax:</p>
              <p class="text-right">₹${sale && parseInt(sale.tax).toFixed(2)}</p>
            </div>
            ${
              sale && sale.discount > 0
                ? `
              <div class="d-flex justify-content-between">
                <p>Discount:</p>
                <p class="text-right">(-) ₹` +
                  parseInt(sale.discount).toFixed(2) +
                  `</p>
              </div>`
                : ""
            }
            <div class="d-flex justify-content-between py-1 my-2" style="border-top:2px dashed #999;border-bottom:2px dashed #999">
              <p style="font-weight:bold" class="">TOTAL:</p>
              <p class="text-right" style="font-weight:bold">₹${
                sale && parseInt(sale.total).toFixed(2)
              }</p>
            </div>
           </div>

           <div class="footer text-center mt-2">
            <p><small>*&nbsp; THANK YOU. VISIT AGAIN &nbsp;*</small></p>
           </div>


          </div>
        </body>
      </html>
      `;
    a.document.write(billContent);
    a.document.close();
    a.print();
    a.onafterprint = function () {
      a.close();
    };
  };

  return (
    <div
      className="modal"
      id="details"
      role="dialog"
      aria-labelledby="detailsModal"
      aria-hidden="true"
      style={{fontSize:"80%"}}
    >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">
                Details of bill #{sale && sale.bill_no}
              </h6>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body monospace">
              <div className="row">
                <div className="col-sm-12">Date: {date}</div>
                <div className="col-sm-12">
                  Customer: {sale && sale.name} ({sale && sale.contact})
                </div>
              </div>
              <hr className="border-secondary" />

              {saleItems &&
                saleItems.map((i, pos) => (
                  <div key={pos} className="row mb-3">
                    <div className="col-sm-12">
                      <strong>{i.name}</strong>
                    </div>
                    <div className="col-sm-12">
                      <div className="row">
                        <div className="col-7">
                          {i.qty} x ₹{i.selling_price}
                        </div>
                        <div className="col-5 text-right">
                        ₹{i.qty * i.selling_price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <hr className="border-secondary" />
              <div className="row">
                <div className="col-6">Sub-total:</div>
                <div className="col-6 text-right">
                  ₹{sale && sale.sub_total}
                </div>
                <div className="col-6">Tax:</div>
                <div className="col-6 text-right">₹{sale && sale.tax}</div>
                {sale && sale.discount > 0 && (
                  <>
                    <div className="col-6">Discount:</div>
                    <div className="col-6 text-right">
                      (-) ₹{sale && Number(sale.discount)}
                    </div>
                  </>
                )}
              </div>
              <hr className="border-secondary mb-1" />
              <div className="row">
                <div className="col-6 font-weight-bold">TOTAL:</div>
                <div className="col-6 font-weight-bold text-right">
                  ₹{sale && sale.total}
                </div>
              </div>
              <hr className="border-secondary mt-1" />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="closeModal"
                className="btn btn-secondary btn-sm rounded-0"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm rounded-0 px-4"
                onClick={() => PrintBill()}
              >
                Print bill
              </button>
            </div>
          </div>
        </div>
     
    </div>
  );
};

export default SaleDetails;
