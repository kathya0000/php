<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/configs/globals",
     *   operationId="globals",
     *   tags={"configurations"},
     *   security={
     *      {"token": {}},
     *   },
     *   summary="Globals configurations",
     *   @OA\Response(
     *      response=200,
     *      description="Success"
     *   ),
     *   @OA\Response(
     *      response=401,
     *       description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *       response=403,
     *       description="Forbidden"
     *   )
     * )
     */
    public function globals(Request $request){
        $configurations = Configuration::where('enabled', 1)->where('public', 1)->where('global', 1)->get();
        return response()->json(['data' => $configurations]);
    }

    /**
     * @OA\Get(
     *   path="/api/configs/public/{key}",
     *   operationId="public",
     *   tags={"configurations"},
     *   security={
     *      {"token": {}},
     *   },
     *   summary="Public configurations",
     *   @OA\Response(
     *      response=200,
     *      description="Success"
     *   ),
     *   @OA\Response(
     *      response=401,
     *       description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *       response=403,
     *       description="Forbidden"
     *   )
     * )
     */
    public function public(Request $request, $key){
        $configurations = Configuration::where('name', $key)->where('enabled', 1)->where('public', 1)->get();
        return response()->json(['data' => $configurations]);
    }
}
