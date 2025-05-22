// src/components/cart/CartSummary.jsx
'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CartSummary() {
  const { items, cartTotal, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({itemCount})</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button className="w-full">Proceed to Checkout</Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}