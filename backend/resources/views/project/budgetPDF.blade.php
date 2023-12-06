<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">

        <title>Reforma</title>

        <style>
            body {
                font-family: Arial, sans-serif;
            }

            h1 {
                text-align: center;
                margin-bottom: 20px;
            }

            h2 {
                margin-top: 30px;
                margin-bottom: 10px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }

            th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }

            th {
                background-color: #f2f2f2;
            }

            tbody tr:hover {
                background-color: #f9f9f9;
            }

            .total-row {
                font-weight: bold;
            }

            .subtotal {
                margin-top: 20px;
                font-weight: bold;
            }

            .total {
                font-size: 18px;
                margin-top: 20px;
                font-weight: bold;
            }

            /* Estilos adicionales para las celdas */
            .align-right {
                text-align: right;
            }

            .align-top {
                vertical-align: top;
            }

            .cell-spacing {
                padding-right: 10px;
            }
        </style>
    </head>
    <body>
        <h1>Presupuesto de Reformas</h1>

        <div>
            <p><strong>Cliente:</strong> {{ $data['client']['name'] }} | <strong>NIF:</strong> {{ $data['client']['nif'] }}</p>
            <p><strong>Dirección:</strong> {{ $data['address'] }}</p>
            <p><strong>Fecha:</strong> {{ $data['fecha']->format('Y-m-d') }}</p>
        </div>

        @foreach ($data['spaces'] as $space)
            <h3 style="margin-bottom: 10px;">{{ $space['type'] }}</h3>

            <table>
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        @foreach ($space['designs_gallery'] as $gallery)
                            <img alt="{{ $space['type'] }}" src="{{ $data['APP_INTERNAL_URL'] }}{{ $gallery->url }}" style="width: 98%; vertical-align: top;">
                        @endforeach
                    </td>
                    <td style="width: 50%; vertical-align: top;">
                        @foreach ($space['walls'] as $wall)
                            @foreach ($wall['designs_gallery'] as $gallery)
                               <img alt="{{ $wall['identifier'] }}" src="{{ $data['APP_INTERNAL_URL'] }}{{ $gallery->url }}" style="width: 48%; vertical-align: top;">
                            @endforeach
                        @endforeach
                    </td>
                </tr>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Referencia</th>
                        <th>Tipo</th>
                        <th>U</th>
                        <th>Descipci&oacute;n</th>
                        <th>Cantidad</th>
                        <th>Precio (&euro;)</th>
                        <th>IVA (&euro;)</th>
                        <th>Importe (&euro;)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($space['elements'] as $element)
                        <tr>
                            <td>{{ $element['reference'] }}</td>
                            <td>{{ $element['type'] }}</td>
                            <td>{{ $element['unit'] }}</td>
                            <td>{{ $element['description'] }}</td>
                            <td class="align-right">{{ $element['quantity'] }}</td>
                            <td class="align-right">{{ number_format($element['price'], 2, ',', '.') }}</td>
                            <td class="align-right">{{ number_format($element['iva'], 2, ',', '.') }}</td>
                            <td class="align-right">{{ number_format($element['amount'], 2, ',', '.') }}</td>
                        </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="4"></td>
                        <td class="align-right" colspan="3"><strong>Total {{ $space['type'] }}</strong></td>
                        <td class="align-right"><strong>{{ number_format($space['total_amount'], 2, ',', '.') }}</strong></td>
                    </tr>
                </tbody>
            </table>
        @endforeach
        <div class="subtotal">Subtotal (sin IVA): {{ number_format($data['total_price'], 2, ',', '.') }} &euro;</div>
        <div class="subtotal">IVA: {{ number_format($data['total_iva'], 2, ',', '.') }} &euro;</div>
        <div class="total">Total Presupuesto: {{ number_format($data['total_amount'], 2, ',', '.') }} &euro;</div>
    </body>
</html>
