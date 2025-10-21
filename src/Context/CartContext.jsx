import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  //Load cart from LocalStorage on page load

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // save cart to localStorage whenever it changes

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // const addToCart = (book)=>{
  //     const existing = cart.find((item)=> item._id === book._id);
  //     if (existing) {
  //         setCart(
  //             cart.map((item)=>{
  //                 cart.map((item)=>
  //                     item._id === book._id ? {...item, quantity: item.quantity + 1}: item
  //                 )
  //             })
  //         )
  //     }else{
  //         setCart([...cart, {...book, quantity: 1}]);
  //     }
  // }

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem._id === item._id || cartItem.book?._id === item._id
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id || cartItem.book?._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // const removeFromCart = (id)=>{
  //     setCart(cart.filter((item)=> item._id !== id));
  // };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart.filter(
        (cartItem) =>
          cartItem._id !== item._id && cartItem.book?._id !== item._id
      )
    );
  };

  const updateQuentity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuentity, clearCart }}
    >
      {" "}
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
