import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Header from "./components/Header";

import Protected from "./components/Protected";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products/Products";
import AddProducts from "./components/Products/AddProducts";
import EditProducts from "./components/Products/EditProduct";
import AddCategories from "./components/Categories/AddCategories";
import Categories from "./components/Categories/Categories";
import EditCategory from "./components/Categories/EditCategory";
import Customers from "./components/Customers/Customers";
import AddCustomers from "./components/Customers/AddCustomers";
import EditCustomer from "./components/Customers/EditCustomer";
import Sales from "./components/Sales/Sales";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/dashboard">
            <Header></Header>
            <Protected Cmp={Dashboard} />
          </Route>

          <Route exact path="/products">
            <Header></Header>
            <Protected Cmp={Products} />
          </Route>

          <Route exact path="/products/add">
            <Header></Header>
            <Protected Cmp={AddProducts} />
          </Route>

          <Route exact path="/products/edit/:id">
            <Header></Header>
            <Protected Cmp={EditProducts} />
          </Route>

          <Route exact path="/categories">
            <Header></Header>
            <Protected Cmp={Categories} />
          </Route>

          <Route exact path="/categories/add">
            <Header></Header>
            <Protected Cmp={AddCategories} />
          </Route>

          <Route exact path="/categories/edit/:id">
            <Header></Header>
            <Protected Cmp={EditCategory} />
          </Route>
          
          <Route exact path="/customers">
            <Header></Header>
            <Protected Cmp={Customers} />
          </Route>

          <Route exact path="/customers/add">
            <Header></Header>
            <Protected Cmp={AddCustomers} />
          </Route>

          <Route exact path="/customers/edit/:id">
            <Header></Header>
            <Protected Cmp={EditCustomer} />
          </Route>

          <Route exact path="/sales">
            <Header></Header>
            <Protected Cmp={Sales} />
          </Route>

          

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/">
            <Login />
          </Route>

          <Route path="/*">
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
