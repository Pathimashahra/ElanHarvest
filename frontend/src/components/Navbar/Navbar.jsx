import React from "react";
import { SiOverleaf } from "react-icons/si";
import {MdMenu,MdOutlineShoppingCart,MdAccountCircle,} from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../../api/cartApi";

const NavbarMenu = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "Products", link: "/products" },
  { id: 3, title: "About Us", link: "/about" },
  { id: 4, title: "Contact Us", link: "/contact" },
];

const Navbar = ({ token, setToken, user }) => {
  const [open, setOpen] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const userId = localUser?._id;

  const fetchCartCount = async () => {
  try {
    if (!userId) return;

    const res = await getCart(userId);

    console.log("CART RESPONSE:", res.data);

    const items =
      res.data.items ||
      res.data.cart?.items ||
      [];

    setCartCount(items.length);

  } catch (err) {
    console.log(err);
    setCartCount(0);
  }
};

  React.useEffect(() => {
    fetchCartCount();
  }, [userId]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchCartCount();
    }, 1500);

    return () => clearInterval(interval);
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-[#FAF7F0] shadow-sm">
        <div className="container flex justify-between items-center py-4 md:pt-4">

          <Link
            to="/"
            className="text-2xl flex items-center gap-2 font-bold uppercase">
            <p className="text-primary">Elan</p>
            <p className="text-secondary">Harvest</p>
            <SiOverleaf className="text-lime-700" />
          </Link>

          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-lg text-gray-700">

              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <Link
                    to={menu.link}
                    className="inline-block py-1 px-3 hover:text-primary font-semibold">
                    {menu.title}
                  </Link>
                </li>
              ))}

              <button
                onClick={() => navigate("/cart")}
                className="relative text-2xl p-2 rounded-full hover:bg-primary hover:text-white">
                <MdOutlineShoppingCart />

                {userId && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {token && token !== "" ? (
                <div className="relative">

                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-4xl text-secondary">
                    <MdAccountCircle />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50 border">

                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-700">
                          Welcome {user?.name || "User"}
                        </p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-3 hover:bg-gray-100">
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-100 text-red-500">
                        Logout
                      </button>

                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-secondary text-white px-5 py-2 rounded-md hover:bg-green-800">
                  Login
                </button>
              )}
            </ul>
          </div>

          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-4xl" />
          </div>

        </div>
      </nav>

      <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;