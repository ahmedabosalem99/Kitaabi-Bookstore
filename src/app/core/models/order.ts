export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryDate: string;
}

interface OrderItem {
  bookId: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
