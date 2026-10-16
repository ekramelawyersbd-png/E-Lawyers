import JSZip from 'jszip';

export async function generateUddoktaPayZip(): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('uddoktapay');

  if (!folder) {
    throw new Error('Failed to create folder in ZIP');
  }

  // 1. gateway.json
  const gatewayJson = {
    name: "UddoktaPay Hosted",
    version: "1.0.0",
    description: "UddoktaPay Hosted Payment Gateway for Paymenter",
    author: "Ekram eLawyersBD",
    website: "https://pay.ekram-elawyersbd.workers.dev",
    type: "gateway",
    slug: "uddoktapay"
  };
  folder.file('gateway.json', JSON.stringify(gatewayJson, null, 2));

  // 2. UddoktaPayController.php
  const controllerPhp = `<?php

namespace App\\Extensions\\Gateways\\UddoktaPay;

use App\\Classes\\Gateway;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Log;

class UddoktaPayController extends Gateway
{
    public function view()
    {
        return 'uddoktapay::index';
    }

    public function pay(Request $request, $invoice)
    {
        $apiKey = $this->config('api_key');
        $hostedUrl = $this->config('hosted_url');
        $isSandbox = $this->config('mode') === 'sandbox';
        
        $gatewayUrl = $isSandbox ? 'https://sandbox.uddoktapay.com/api/v1/checkout-v2' : rtrim($hostedUrl, '/') . '/api/v1/checkout-v2';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'RT-UDDOKTAPAY-API-KEY' => $apiKey,
        ])->post($gatewayUrl, [
            'full_name' => $invoice->user->name ?? 'Customer',
            'email' => $invoice->user->email ?? 'customer@example.com',
            'amount' => $invoice->total,
            'metadata' => [
                'invoice_id' => $invoice->id,
            ],
            'redirect_url' => route('clients.invoice.show', $invoice->id),
            'cancel_url' => route('clients.invoice.show', $invoice->id),
            'webhook_url' => url('/gateway/uddoktapay/ipn'),
        ]);

        if ($response->successful() && isset($response->json()['payment_url'])) {
            return redirect($response->json()['payment_url']);
        }

        Log::error('UddoktaPay Gateway Error: ' . $response->body());
        return redirect()->back()->with('error', 'Unable to initiate UddoktaPay payment.');
    }

    public function ipn(Request $request)
    {
        $apiKey = $request->header('RT-UDDOKTAPAY-API-KEY');
        $expectedApiKey = $this->config('api_key');

        if ($apiKey !== $expectedApiKey) {
            return response()->json(['error' => 'Unauthorized signature/API key'], 401);
        }

        $status = $request->input('status');
        $invoiceId = $request->input('invoice_id') ?? $request->input('metadata')['invoice_id'] ?? null;
        $transactionId = $request->input('transaction_id');

        if ($status === 'COMPLETED' && $invoiceId) {
            \\App\\Models\\Invoice::where('id', $invoiceId)->update(['status' => 'paid']);
            Log::info("UddoktaPay IPN Success for Invoice ID: {$invoiceId}, TxID: {$transactionId}");
        }

        return response()->json(['status' => 'success'], 200);
    }
}
`;
  folder.file('UddoktaPayController.php', controllerPhp);

  // 3. README.md
  const readmeMd = `# UddoktaPay Hosted Payment Gateway for Paymenter

## Installation Instructions
1. Upload the entire \`uddoktapay\` folder to \`extensions/Gateways/uddoktapay\` in your Paymenter installation.
2. Open your Paymenter Admin Panel.
3. Navigate to **Gateways > Add New**.
4. Select **"UddoktaPay Hosted"**.
5. Enter your API Key, Secret Key, and Hosted URL / Sandbox URL.
6. Click **Save**. You are ready to accept secure automated mobile banking and card payments in Bangladesh!

## IPN Webhook URL
\`https://blog.accounticca.com/gateway/uddoktapay/ipn\`
`;
  folder.file('README.md', readmeMd);

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}
