<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/auth/check",
     *   operationId="check",
     *   tags={"auth"},
     *   security={
     *      {"token": {}},
     *   },
     *   summary="Check",
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
    public function check(Request $request){
        return response()->json();
    }
}
