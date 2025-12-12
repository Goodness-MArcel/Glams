import { supabaseServer as supabase } from '../supabase/serverConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

if (!PAYSTACK_SECRET) {
  console.warn('PAYSTACK_SECRET not set - Paystack endpoints will fail');
}

// Use global fetch when available (Node 18+). If not available, attempt to dynamically
// import 'node-fetch' at runtime. This avoids requiring node-fetch in environments
// where global fetch exists and prevents start-up failures when node-fetch isn't installed.
async function getFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try {
    const mod = await import('node-fetch');
    return mod.default || mod;
  } catch (err) {
    console.error('Fetch API is not available and node-fetch could not be imported:', err);
    throw err;
  }
}

export async function initializePaystack(req, res) {
  try {
    const { email, amount, orderData } = req.body;
    if (!email || !amount) return res.status(400).json({ message: 'Missing email or amount' });

    // Paystack expects amount in kobo (NGN * 100)
    const kobo = Math.round(Number(amount) * 100);

    const body = {
      email,
      amount: kobo,
      callback_url: `${FRONTEND_URL}/checkout`,
      metadata: {
        order: orderData || {}
      }
    };

    const fetch = await getFetch();
    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!data || !data.status) {
      return res.status(502).json({ message: 'Paystack initialization failed', detail: data });
    }

    return res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
  } catch (err) {
    console.error('Error initializing Paystack:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function verifyPaystack(req, res) {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ message: 'Missing reference' });

    console.log('Verifying payment with reference:', reference);

    const fetch = await getFetch();
    const resp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`
      }
    });

    const data = await resp.json();
    console.log('Paystack verification response:', data);

    if (!data || !data.status) {
      console.error('Paystack verification failed:', data);
      return res.status(400).json({ message: 'Payment not verified', detail: data });
    }

    const payment = data.data;
    if (payment.status !== 'success') {
      console.error('Payment status not successful:', payment.status);
      return res.status(400).json({ message: 'Payment not successful', status: payment.status });
    }

    // Extract order metadata
    const metadata = payment.metadata || {};
    const orderPayload = metadata.order || {};

    console.log('Order payload from metadata:', orderPayload);

    // Build order record to insert into Supabase
    const orderRecord = {
      items: orderPayload.items || [],
      customer: orderPayload.customer || {},
      payment: {
        provider: 'paystack',
        reference: reference,
        amount: payment.amount / 100,
        channel: payment.channel,
        paid_at: payment.paid_at || new Date().toISOString()
      },
      totals: orderPayload.totals || {},
      order_date: new Date().toISOString(),
      status: 'paid',
      delivery_method: orderPayload.customer?.deliveryMethod || 'home',
      delivery_address: orderPayload.customer?.address || '',
      delivery_city: orderPayload.customer?.city || '',
      delivery_state: orderPayload.customer?.state || '',
      delivery_zip_code: orderPayload.customer?.zipCode || '',
      special_instructions: orderPayload.payment?.specialInstructions || ''
    };

    console.log('Order record to insert:', orderRecord);

    // Insert into orders table
    const { data: inserted, error } = await supabase.from('orders').insert(orderRecord).select();
    if (error) {
      console.error('Error inserting order into Supabase:', error);
      return res.status(500).json({
        message: 'Failed to save order',
        detail: error,
        orderRecord: orderRecord
      });
    }

    console.log('Order saved successfully:', inserted[0]);
    return res.json({ message: 'Payment verified and order saved', order: inserted[0] });
  } catch (err) {
    console.error('Error verifying Paystack payment:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message
    });
  }
}
