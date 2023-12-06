<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

/**
 * @OA\Tag(
 *     name="files",
 * )
 */
class FileController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/files/upload",
     *     operationId="upload",
     *     tags={"files"},
     *     security={
     *        {"token": {}},
     *     },
     *     summary="Upload a file",
     *     description="Upload a file to the server",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="file",
     *                     description="Archivo a subir",
     *                     type="file",
     *                 ),
     *                 required={"file"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\MediaType(
     *             mediaType="application/json",
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Failed"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *        response=403,
     *        description="Forbidden"
     *     )
     * )
     */
    public function upload(Request $request)
    {
        /*$this->validate($request, [
            'image' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ]);*/
        $filePath = $request->file('file')->store('files', 'public');
        return response()->json([
            'file' => Storage::url($filePath)
        ]);
    }
}
