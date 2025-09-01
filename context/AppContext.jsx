"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { err } from "inngest/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(true);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user.publicMetadata.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();

      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        // Ensure cartItems is always an object
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId) => {
    try {
      // Ensure cartItems is always an object
      const currentCartItems = cartItems || {};
      let cartData = structuredClone(currentCartItems);

      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }

      setCartItems(cartData);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      // Ensure cartItems is always an object
      const currentCartItems = cartItems || {};
      let cartData = structuredClone(currentCartItems);

      if (quantity === 0) {
        delete cartData[itemId];
      } else {
        cartData[itemId] = quantity;
      }

      setCartItems(cartData);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error("Failed to update cart quantity");
    }
  };

  const getCartCount = () => {
    try {
      const currentCartItems = cartItems || {};
      let totalCount = 0;
      for (const items in currentCartItems) {
        if (currentCartItems[items] > 0) {
          totalCount += currentCartItems[items];
        }
      }
      return totalCount;
    } catch (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }
  };

  const getCartAmount = () => {
    try {
      const currentCartItems = cartItems || {};
      let totalAmount = 0;
      for (const items in currentCartItems) {
        let itemInfo = products.find((product) => product._id === items);
        if (currentCartItems[items] > 0 && itemInfo) {
          totalAmount += itemInfo.offerPrice * currentCartItems[items];
        }
      }
      return Math.floor(totalAmount * 100) / 100;
    } catch (error) {
      console.error("Error getting cart amount:", error);
      return 0;
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
