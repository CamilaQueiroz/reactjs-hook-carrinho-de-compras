import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { api } from "../../services/api";
import { Stock } from "../../types";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  const [stock, setStock] = useState<Stock[]>([]);

  const cartFormatted = cart.map((product) => {
    const format = formatPrice(product.price);
    const subTotal = formatPrice(product.amount * product.price);
    return { ...product, priceFormatted: format, subTotal };
  });

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      const subTotal = product.price * product.amount;
      sumTotal += subTotal;
      return sumTotal;
    }, 0)
  );

  function handleProductIncrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount + 1 });
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount - 1 });
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  // useEffect(() => {
  //   async function loadStock() {
  //     await api.get("/stock").then((response) => {
  //       setStock(response.data);
  //     });
  //   }

  //   loadStock();
  // }, []);

  return (
    <Container>
      <ProductTable>
        <>
          <thead>
            <tr>
              <th aria-label="product image"></th>
              <th>PRODUTO</th>
              <th>QTD</th>
              <th>SUBTOTAL</th>
              <th aria-label="delete icon"></th>
            </tr>
          </thead>
          <tbody>
            {cartFormatted.map((product) => (
              <tr data-testid="product" key={product.id}>
                <td>
                  <img src={product.image} alt={product.title} />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <span>{product.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={product.amount <= 1}
                      onClick={() => handleProductDecrement(product)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={product.amount}
                    />
                    <button
                      type="button"
                      // disabled={
                      //   stock[product.id - 1]?.amount < product.amount + 1
                      // }
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(product)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{product.subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
