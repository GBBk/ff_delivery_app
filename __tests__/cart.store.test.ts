import { useCartStore } from "@/store/cart.store";
import type { CartCustomization } from "@/type";

const burger = { id: "burger", name: "Classic Burger", price: 10, image_url: "burger.png" };
const cheese: CartCustomization = { id: "cheese", name: "Extra cheese", price: 1.5, type: "topping" };
const bacon: CartCustomization = { id: "bacon", name: "Bacon", price: 2, type: "topping" };

const store = () => useCartStore.getState();

beforeEach(() => {
  store().clearCart();
});

describe("cart store", () => {
  it("agrega un producto con cantidad 1", () => {
    store().addItem(burger);
    expect(store().items).toEqual([{ ...burger, quantity: 1, customizations: [] }]);
  });

  it("suma cantidad si el producto y los extras son iguales", () => {
    store().addItem({ ...burger, customizations: [cheese, bacon] });
    store().addItem({ ...burger, customizations: [bacon, cheese] });
    expect(store().items).toHaveLength(1);
    expect(store().items[0].quantity).toBe(2);
  });

  it("separa el mismo producto con extras distintos", () => {
    store().addItem(burger);
    store().addItem({ ...burger, customizations: [cheese] });
    expect(store().items).toHaveLength(2);
  });

  it("elimina el producto al bajar la cantidad a 0", () => {
    store().addItem(burger);
    store().decreaseQty("burger", []);
    expect(store().items).toEqual([]);
  });

  it("solo quita la variante con los extras indicados", () => {
    store().addItem(burger);
    store().addItem({ ...burger, customizations: [cheese] });
    store().removeItem("burger", [cheese]);
    expect(store().items).toHaveLength(1);
    expect(store().items[0].customizations).toEqual([]);
  });

  it("calcula el total de unidades y el precio con extras", () => {
    store().addItem({ ...burger, customizations: [cheese] }); // 11.5
    store().increaseQty("burger", [cheese]); // x2 = 23
    store().addItem(burger); // + 10
    expect(store().getTotalItems()).toBe(3);
    expect(store().getTotalPrice()).toBeCloseTo(33);
  });
});
