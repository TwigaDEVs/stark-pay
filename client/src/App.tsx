import "./App.css";
import { Navbar, Footer } from "./components";
import {
  Home,
  Profile,
  Item,
  Create,
  Login,
  Register,
  Explore,
  Checkout,
  Checkouts,
} from "./pages";
import { Routes, Route } from "react-router-dom";
import AppProvider from "./providers/AppProvider";

function App() {
  return (
    <div>
      <AppProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path=":item/:id" element={<Item />} />
          <Route path="/create" element={<Create />} />
          <Route path="/approve-code" element={<Checkout />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Explore />} />
          <Route path="/checkouts" element={<Checkouts />} />
        </Routes>
        <Footer />
      </AppProvider>
    </div>
  );
}

export default App;
