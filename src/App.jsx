import { Route, Routes, Link, BrowserRouter} from "react-router-dom";
import {
  View,
  Heading,
} from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import './App.css';

import PizzaPage from './PizzaPage';
import ToppingsPage from './ToppingsPage';
import Header from './Header';


function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
      <Route
          path="/"
          element={
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
              }}
            >
              <Heading level={2} marginBottom="1rem" color={"gray"}>
                Manage Your Pizzeria 🍕
              </Heading>
              
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <li>
                  <Link
                    to="/toppingspage"
                    style={{
                      display: "block",
                      padding: "10px 20px",
                      backgroundColor: "#0073e6",
                      color: "white",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold",
                      width: "120px",
                    }}
                  >
                    Toppings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pizzapage"
                    style={{
                      display: "block",
                      padding: "10px 20px",
                      backgroundColor: "#0073e6",
                      color: "white",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "bold",
                      width: "120px",
                    }}
                  >
                    Pizza
                  </Link>
                </li>
              </ul>
            </View>
          }
        />
        <Route path="/pizzapage" element={<PizzaPage/>}></Route>
        <Route path="/toppingspage" element={<ToppingsPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
