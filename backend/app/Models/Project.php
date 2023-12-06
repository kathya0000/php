<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Foreach_;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            $project->created_by = Auth::id();
            $project->created_by_name = Auth::user()->name;
            $project->enabled = 1;
            $project->budget = $project->calculateBudget();
        });

        static::updating(function (Project $project) {
            $project->updated_by = Auth::id();
            $project->updated_by_name = Auth::user()->name;
            $project->budget = $project->calculateBudget();
        });
    }

    public function calculateBudget()
    {
        $spacesData = json_decode($this->spaces_data);
        $budget = 0;
        foreach ($spacesData as $spaceData) {
            if (count($spaceData->doors) > 0) {
                foreach ($spaceData->doors as $door) {
                    if ($door->door_change) {
                        $doorIVA = 0;
                        if (isset($door->door_new_iva_percent)) {
                            $doorIVA = round($door->door_new_iva_percent / 100 * $door->door_new_price, 2);
                        } else {
                            $doorIVA = Door::find($door->door_new_id)->iva;
                        }

                        $doorLabourIVA = 0;
                        if (isset($door->door_labour_iva_percent)) {
                            $doorLabourIVA = round($door->door_labour_iva_percent / 100 * $door->door_labour_price, 2);
                        } else {
                            $doorLabourIVA = Labour::find($door->door_labour_id)->iva;
                        }

                        $budget += $door->door_new_price + $doorIVA + $door->door_labour_price + $doorLabourIVA;
                    }
                }
            }

            if ($spaceData->window_has_window) {
                foreach ($spaceData->windows as $window) {
                    if ($window->window_change) {
                        $windowIVA = 0;
                        if (isset($window->window_new_iva_percent)) {
                            $windowIVA = round($window->window_new_iva_percent / 100 * $window->window_new_price, 2);
                        } else {
                            $windowIVA = Window::find($window->window_new_id)->iva;
                        }

                        $windowLabourIVA = 0;
                        if (isset($window->window_labour_iva_percent)) {
                            $windowLabourIVA = round($window->window_labour_iva_percent / 100 * $window->window_labour_price, 2);
                        } else {
                            $windowLabourIVA = Labour::find($window->window_labour_id)->iva;
                        }

                        $budget += $window->window_new_price + $windowIVA + $window->window_labour_price + $windowLabourIVA;
                    }

                    if ($window->window_blind_has_blind && $window->window_blind_change) {
                        $blindIVA = 0;
                        if (isset($window->window_blind_new_iva_percent)) {
                            $blindIVA = round($window->window_blind_new_iva_percent / 100 * $window->window_blind_new_price, 2);
                        } else {
                            $blindIVA = Blind::find($window->window_blind_new_id)->iva;
                        }

                        $blindLabourIVA = 0;
                        if (isset($window->window_blind_labour_iva_percent)) {
                            $blindLabourIVA = round($window->window_blind_labour_iva_percent / 100 * $window->window_blind_labour_price, 2);
                        } else {
                            $blindLabourIVA = Labour::find($window->window_blind_labour_id)->iva;
                        }

                        $budget += $window->window_blind_new_price + $blindIVA + $window->window_blind_labour_price + $blindLabourIVA;
                    }
                }
            }
            if (count($spaceData->modules) > 0) {
                foreach ($spaceData->modules as $module) {
                    if ($module->module_make_new_installation) {
                        if (count($module->mechanisms) > 0) {
                            foreach ($module->mechanisms as $mechanism) {
                                if ($mechanism->module_mechanism_show_price) {
                                    $mechanismIVA = 0;
                                    if (isset($mechanism->module_mechanism_new_iva_percent)) {
                                        $mechanismIVA = round($mechanism->module_mechanism_new_iva_percent / 100 * $mechanism->module_mechanism_new_price, 2);
                                    } else {
                                        $mechanismIVA = ElectricalMechanism::find($mechanism->module_mechanism_new_id)->iva;
                                    }

                                    $mechanismInstallationIVA = 0;
                                    if (isset($mechanism->module_mechanism_installation_iva_percent)) {
                                        $mechanismInstallationIVA = round($mechanism->module_mechanism_installation_iva_percent / 100 * $mechanism->module_mechanism_installation_price, 2);
                                    } else {
                                        $mechanismInstallationIVA = ElectricalMechanism::find($mechanism->module_mechanism_new_id)->installation_iva_percent;
                                    }

                                    $budget += $mechanism->module_mechanism_new_price + $mechanismIVA + $mechanism->module_mechanism_installation_price + $mechanismInstallationIVA;
                                }
                            }
                        }

                        if ($module->module_frame_new_id != null) {
                            $frameIVA = 0;
                            if (isset($module->module_frame_new_iva_percent)) {
                                $frameIVA = round($module->module_frame_new_iva_percent / 100 * $module->module_frame_new_price, 2);
                            } else {
                                $frameIVA = ElectricalMechanism::find($module->module_frame_new_id)->iva;
                            }

                            $frameInstallationIVA = 0;
                            if (isset($module->module_frame_installation_iva_percent)) {
                                $frameInstallationIVA = round($module->module_frame_installation_iva_percent / 100 * $module->module_frame_installation_price, 2);
                            } else {
                                $frameInstallationIVA = ElectricalMechanism::find($module->module_frame_new_id)->installation_iva_percent;
                            }

                            $budget += $module->module_frame_new_price + $frameIVA + $module->module_frame_installation_price + $frameInstallationIVA;
                        }
                    }
                }
            }
        }
        return round($budget, 2);
    }

    public function getReportData()
    {
        $data = array();
        $clientData = json_decode($this->client_data);
        $data['client'] = [
            'name' => (!is_null($clientData->first_name) ? $clientData->first_name . ' ' . (!is_null($clientData->last_name) ? $clientData->last_name : '') : (!is_null($clientData->last_name) ? $clientData->last_name : '')),
            'company' => $clientData->company,
            'email' => $clientData->email,
            'cellphone' => $clientData->cellphone,
            'nif' => $clientData->nif
        ];
        $addressData = json_decode($this->address_data);
        $data['address'] = $addressData->street . ' ' . $addressData->additional;
        $data['fecha'] = $this->created_at;
        $spaces = [];
        $totalPrice = 0;
        $totalIVA = 0;

        $spacesData = json_decode($this->spaces_data);

        foreach ($spacesData as $key => $space) {
            $elements = array();
            $totalPriceSpace = 0;
            $totalIVASpace = 0;
            foreach ($space->doors as $door) {
                if ($door->door_change) {
                    $doorObject = Door::find($door->door_new_id);
                    $iva = isset($door->door_new_iva_percent) ? (round($door->door_new_iva_percent / 100 * $door->door_new_price, 2)) : $doorObject->iva;

                    $element = array(
                        'wall_identifier' => $door->door_wall_identifier,
                        'reference' => $doorObject->reference,
                        'type' => 'Puerta',
                        'unit' => 'Uno',
                        'description' => $doorObject->name,
                        'quantity' => 1,
                        'price' => $door->door_new_price,
                        'iva' => $iva,
                        'amount' => $door->door_new_price + $iva
                    );
                    $elements[] = $element;
                    $totalPriceSpace += $element['price'];
                    $totalIVASpace += $element['iva'];


                    $labourObject = Labour::find($door->door_labour_id);
                    $iva = isset($door->door_labour_iva_percent) ? (round($door->door_labour_iva_percent / 100 * $door->door_labour_price, 2)) : $labour->iva;

                    $element = array(
                        'wall_identifier' => $door->door_wall_identifier,
                        'reference' => $labourObject->reference,
                        'type' => 'Mano de obra',
                        'unit' => 'Uno',
                        'description' => $labourObject->work_do,
                        'quantity' => 1,
                        'price' => $door->door_labour_price,
                        'iva' => $iva,
                        'amount' => $door->door_labour_price + $iva
                    );
                    $elements[] = $element;
                    $totalPriceSpace += $element['price'];
                    $totalIVASpace += $element['iva'];
                }
            }

            if ($space->window_has_window) {
                foreach ($space->windows as $key1 => $window) {
                    if ($window->window_change) {
                        $windowObject = Window::find($window->window_new_id);
                        $iva = isset($window->window_new_iva_percent) ? (round($window->window_new_iva_percent / 100 * $window->window_new_price, 2)) : $windowObject->iva;

                        $element = array(
                            'wall_identifier' => $window->window_wall_identifier,
                            'reference' => $windowObject->reference,
                            'type' => 'Ventana',
                            'unit' => 'Uno',
                            'description' => $windowObject->name,
                            'quantity' => 1,
                            'price' => $window->window_new_price,
                            'iva' => $iva,
                            'amount' => $window->window_new_price + $iva
                        );
                        $elements[] = $element;
                        $totalPriceSpace += $element['price'];
                        $totalIVASpace += $element['iva'];

                        $labour = Labour::find($window->window_labour_id);
                        $iva = isset($window->window_labour_iva_percent) ? (round($window->window_labour_iva_percent / 100 * $window->window_labour_price, 2)) : $labour->iva;

                        $element = array(
                            'wall_identifier' => $window->window_wall_identifier,
                            'reference' => $labour->reference,
                            'type' => 'Mano de obra',
                            'unit' => 'Uno',
                            'description' => $labour->work_do,
                            'quantity' => 1,
                            'price' => $window->window_labour_price,
                            'iva' => $iva,
                            'amount' => $window->window_labour_price + $iva
                        );
                        $elements[] = $element;
                        $totalPriceSpace += $element['price'];
                        $totalIVASpace += $element['iva'];
                    }

                    if ($window->window_blind_has_blind && $window->window_blind_change) {
                        $blindObject = Blind::find($window->window_blind_new_id);
                        $iva = isset($window->window_blind_new_iva_percent) ? (round($window->window_blind_new_iva_percent / 100 * $window->window_blind_new_price, 2)) : $blindObject->iva;

                        $element = array(
                            'wall_identifier' => $window->window_wall_identifier,
                            'reference' => $blindObject->reference,
                            'type' => 'Perciana',
                            'unit' => 'Uno',
                            'description' => $blindObject->name,
                            'quantity' => 1,
                            'price' => $window->window_blind_new_price,
                            'iva' => $iva,
                            'amount' => $window->window_blind_new_price + $iva
                        );
                        $elements[] = $element;
                        $totalPriceSpace += $element['price'];
                        $totalIVASpace += $element['iva'];

                        $labour = Labour::find($window->window_blind_labour_id);
                        $iva = isset($window->window_blind_labour_iva_percent) ? (round($window->window_blind_labour_iva_percent / 100 * $window->window_blind_labour_price, 2)) : $labour->iva;

                        $element = array(
                            'wall_identifier' => $window->window_wall_identifier,
                            'reference' => $labour->reference,
                            'type' => 'Mano de obra',
                            'unit' => 'Uno',
                            'description' => $labour->work_do,
                            'quantity' => 1,
                            'price' => $window->window_blind_labour_price,
                            'iva' => $iva,
                            'amount' => $window->window_blind_labour_price + $iva
                        );
                        $elements[] = $element;
                        $totalPriceSpace += $element['price'];
                        $totalIVASpace += $element['iva'];
                    }
                }
            }

            foreach ($space->modules as $module) {
                if ($module->module_make_new_installation) {
                    if (count($module->mechanisms) > 0) {
                        foreach ($module->mechanisms as $mechanism) {
                            if ($mechanism->module_mechanism_show_price) {
                                $mechanismObject = ElectricalMechanism::find($mechanism->module_mechanism_new_id);

                                $iva = round($mechanism->module_mechanism_new_iva_percent / 100 * $mechanism->module_mechanism_new_price, 2);

                                $element = array(
                                    'wall_identifier' => $module->module_wall_identifier,
                                    'reference' => $mechanismObject->reference,
                                    'type' => 'Mecanismo eléctrico',
                                    'unit' => 'Uno',
                                    'description' => $mechanismObject->name,
                                    'quantity' => 1,
                                    'price' => $mechanism->module_mechanism_new_price,
                                    'iva' => $iva,
                                    'amount' => $mechanism->module_mechanism_new_price + $iva
                                );
                                $elements[] = $element;
                                $totalPriceSpace += $element['price'];
                                $totalIVASpace += $element['iva'];

                                $iva = round($mechanism->module_mechanism_installation_iva_percent / 100 * $mechanism->module_mechanism_installation_price, 2);

                                $element = array(
                                    'wall_identifier' => $module->module_wall_identifier,
                                    'reference' => '',
                                    'type' => 'Instalación de mecanismo eléctrico',
                                    'unit' => 'Uno',
                                    'description' => 'Instalación de ' . $mechanismObject->name,
                                    'quantity' => 1,
                                    'price' => $mechanism->module_mechanism_installation_price,
                                    'iva' => $iva,
                                    'amount' => $mechanism->module_mechanism_installation_price + $iva
                                );
                                $elements[] = $element;
                                $totalPriceSpace += $element['price'];
                                $totalIVASpace += $element['iva'];
                            }
                        }
                    }

                    if ($module->module_frame_new_id != null) {
                        $frameObject = ElectricalMechanism::find($module->module_frame_new_id);

                        $iva = round($module->module_frame_new_iva_percent / 100 * $module->module_frame_new_price, 2);

                        $element = array(
                            'wall_identifier' => $module->module_wall_identifier,
                            'reference' => $frameObject->reference,
                            'type' => 'Marco',
                            'unit' => 'Uno',
                            'description' => $frameObject->name,
                            'quantity' => 1,
                            'price' => $module->module_frame_new_price,
                            'iva' => $iva,
                            'amount' => $module->module_frame_new_price + $iva
                        );
                        $elements[] = $element;
                        $totalPriceSpace += $element['price'];
                        $totalIVASpace += $element['iva'];

                        $iva = round($module->module_frame_installation_iva_percent / 100 * $module->module_frame_installation_price, 2);

                        $element = array(
                            'wall_identifier' => $module->module_wall_identifier,
                            'reference' => '',
                            'type' => 'Instalación de marco',
                            'unit' => 'Uno',
                            'description' => 'Instalación de ' . $frameObject->name,
                            'quantity' => 1,
                            'price' => $module->module_frame_installation_price,
                            'iva' => $iva,
                            'amount' => $module->module_frame_installation_price + $iva
                        );
                        $elements[] = $element;
                        $totalPriceSpace += $element['price'];
                        $totalIVASpace += $element['iva'];
                    }
                }
            }

            $walls = array();
            foreach ($space->walls as $wall) {
                $value = array(
                    'identifier' => $wall->wall_identifier,
                    'designs_gallery' => $wall->designs_gallery
                );
                $walls[] = $value;
            }

            if (count($elements) > 0) {
                $space = array(
                    'type' => SpaceType::find($space->space_type_id)->name,
                    'designs_gallery' => $space->designs_gallery,
                    'walls' => $walls,
                    'total_price' => $totalPriceSpace,
                    'total_iva' => $totalIVASpace,
                    'total_amount' => $totalPriceSpace + $totalIVASpace,
                    'elements' => $elements
                );
                $spaces[] = $space;
                $totalPrice += $totalPriceSpace;
                $totalIVA += $totalIVASpace;
            }
        }
        $data['total_price'] = $totalPrice;
        $data['total_iva'] = $totalIVA;
        $data['total_amount'] = $totalPrice + $totalIVA;
        $data['spaces'] = $spaces;

        $data['APP_INTERNAL_URL'] = env('APP_INTERNAL_URL', env('APP_URL', 'http://localhost'));

        return $data;
    }
}
