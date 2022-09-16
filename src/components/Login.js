import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";

export default function Login() {
  const history = useHistory();

  const [Uname, setUname] = useState("");
  const [Pwd, setPwd] = useState("");

  // For Error/Success Messages
  const [Msg, setMsg] = useState("");
  const [MsgType, setMsgType] = useState("d-none");

  const submitLogin = (event) => {
    const btn = document.getElementById("submit");
    const btnText = btn.innerHTML;
    btn.classList.add("disabled");
    btn.innerHTML = "Authenticating...";
    setPwd("");
    event.preventDefault();
    axios
      .post(`${process.env.REACT_APP_SERVER_API}main/?f=login`, {
        uname: Uname,
        pwd: Pwd,
      })
      .then(function (response) {
        localStorage.clear();
        if (response.data.status === 200) {
          setMsg("Login successful");
          setMsgType("success d-block");
          const token = response.data.info["api_key"];
          delete response.data.info["api_key"];
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("uInfo", JSON.stringify(response.data.info));
          history.push("/dashboard");
          return;
        } else if (response.data.status === 401) {
          setMsg("Invalid Username/Password. Please try again.");
          setMsgType("danger d-block");
        } else if (response.data.status === 403) {
          setMsg(
            "!! This user is banned from using this software. Contact support !!"
          );
          setMsgType("warning d-block");
        } else if (response.data.status === 503) {
          setMsg("Gateway timeout");
          setMsgType("warning d-block");
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        btn.classList.remove("disabled");
        btn.innerHTML = btnText;
      });
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        history.push("/dashboard")
      ) : (
        <div className="loginbody">
          <div className="container">
            <form className="form-signin text-center" onSubmit={submitLogin}>
              <img className="" src="/images/login.png" alt="" width="150" />
              <h1 className="h3 mb-5 font-weight-normal">
                Welcome to DigiKraft POS
              </h1>
              <h1 className="h5 mb-4 font-weight-normal">
                Log in to start billing
              </h1>

              <div className="input-group">
                <input
                  type="text"
                  id="inputEmail"
                  value={Uname}
                  onChange={(e) => setUname(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Email address"
                  required
                  autoFocus
                />
              </div>

              <div className="input-group">
                <input
                  id="inputPassword"
                  type="password"
                  value={Pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="form-control mb-3"
                  placeholder="Password"
                  required
                />
              </div>
              <button
                className="btn btn-dark btn-block py-2"
                id="submit"
                type="submit"
              >
                Login →
              </button>
              <br />
              <Alert MsgType={MsgType} Msg={Msg}></Alert>

              <footer className="footer">
                <div className="container">
                  <span className="text-muted">
                    For support visit{" "}
                    <a
                      href="http://digikraftsocial.com"
                      rel="noreferrer"
                      target="_blank"
                    >
                      DigiKraft Social{" "}
                    </a>
                    &nbsp; |&nbsp; &copy; {new Date().getFullYear()}
                  </span>
                </div>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
