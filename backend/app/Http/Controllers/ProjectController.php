<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ProjectController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/projects/{id}/budgetpdf",
     *   operationId="budgetPDF",
     *   tags={"projects"},
     *   security={
     *      {"token": {}},
     *   },
     *   summary="Budget of the Project(PDF)",
     *   @OA\Parameter(
     *      name="id",
     *      required=true,
     *      in="path",
     *      @OA\Schema(
     *          type="integer"
     *      )
     *   ),
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
    public function budgetPDF(Request $request, $id){
        $project = Project::find($id);
        $data = $project->getReportData();
        $pdf = Pdf::loadView('project/budgetPDF', compact('data'));
        return $pdf->stream();
    }
}
