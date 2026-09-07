import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare var Razorpay: any;

export interface RazorpayOrder {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface UserPrefill {
  name: string;
  email: string;
  contact: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  createOrder(orderData: { shipping_address: string, phone_number: string }): Observable<RazorpayOrder> {
    return this.http.post<RazorpayOrder>(`${this.apiUrl}/create_order/`, orderData);
  }

  verifyPayment(paymentData: PaymentVerification): Observable<{ message: string, order_id: string }> {
    return this.http.post<{ message: string, order_id: string }>(`${this.apiUrl}/verify_payment/`, paymentData);
  }

  paymentFailed(orderId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/payment_failed/`, { razorpay_order_id: orderId });
  }

  initiatePayment(
    orderData: RazorpayOrder,
    prefill: UserPrefill,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ): void {
    const options = {
      key: orderData.key,
      amount: Math.round(orderData.amount * 100), // backend sends rupees; Razorpay SDK needs paise
      currency: orderData.currency,
      name: 'Kasavelli - 925 Silver Jewellery',
      description: 'Purchase of 925 Silver Jewellery',
      order_id: orderData.order_id,
      handler: (response: any) => {
        onSuccess(response);
      },
      prefill: {
        name: prefill.name,
        email: prefill.email,
        contact: prefill.contact
      },
      theme: {
        color: '#551756'
      },
      modal: {
        ondismiss: () => {
          onFailure({ error: 'Payment cancelled by user' });
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      onFailure(response.error);
    });
    rzp.open();
  }
}
