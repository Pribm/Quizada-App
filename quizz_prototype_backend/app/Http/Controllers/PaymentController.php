<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use MercadoPago;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function pix(Request $request)
    {

        $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
        ->contentType('application/json')
        ->accept('application/json')
        ->post('https://api.mercadopago.com/v1/payments', [
            "transaction_amount" => (int)$request->amount,
            "description" => "Transferência para aplicativo Quizada",
            "payment_method_id" => "pix",
            "payer" => [
                "email" => $request->email,
                "first_name" => $request->name,
                "last_name" => $request->surName,
                "identification" => [
                    "type" => $request->docType,
                    "number" => $request->docNumber
                ]
            ],
        ]);

        return $response;
    }
}
