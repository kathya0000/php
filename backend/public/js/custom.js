
// ---------------------------------------------------------------------------------------

let apply_class_to_fields_if_are_not_configured_from_bread_admin = (configs) => {

    configs.forEach((config) => {

        if ($('body.' + config.page + ' [name="' + config.fieldname + '"]').parent().hasClass('col-md-custom-from-js')) {

            $('body.' + config.page + ' [name="' + config.fieldname + '"]').parent()
                // ---------------------------
                .removeClass('col-xl-4')
                .removeClass('col-lg-4')
                .removeClass('col-md-4')
                .removeClass('col-sm-6')
                .removeClass('col-xs-12')
                // ---------------------------
                ;

            config.classes.forEach((class_) => {

                $('body.' + config.page + ' [name="' + config.fieldname + '"]').parent()
                    // ---------------------------
                    .addClass(class_)
                    // ---------------------------
                    ;
            })
        }
    });
}

// ---------------------------------------------------------------------------------------

$(document).ready(function () {

    //---------------------------------------------------------------------------

    // LIST & PAGINATION

    $('#bulk_delete_btn').parent().addClass('text-right');

    // hide deleting toggle button

    $('#bulk_delete_btn').parent().find('> .toggle').addClass('hidden');

    // hide table actions button labels

    $('#dataTable tr td.bread-actions a > span.hidden-xs').addClass('hidden');

    //---------------------------------------------------------------------------

    // ADD EDIT FORMS

    // correct ids for inputs without id && label for in labels without for

    $('form.form-edit-add .panel-body > .form-group').each((index, formGroup) => {
        $($(formGroup).find('> .form-control')[0]).attr('id', $($(formGroup).find('> .form-control')[0]).attr('name'));
        $($(formGroup).find('> .control-label')[0]).attr('for', $($(formGroup).find('> .form-control')[0]).attr('name'));
    });

    // form fields width classes

    $('form.form-edit-add .panel-body > .form-group')
        .not('.col-md-custom-from-bread-admin')
        .not('.col-md-custom-from-js')
        // ---------------------------
        .removeClass('col-md-12')
        // ---------------------------
        .addClass('col-xl-4')
        .addClass('col-lg-4')
        .addClass('col-md-4')
        .addClass('col-sm-6')
        .addClass('col-xs-12')
        // ---------------------------
        .addClass('col-md-custom-from-js')
        // ---------------------------
        ;

    //---------------------------------------------------------------------------

    // USERS ADD EDIT

    $('body.users form.form-edit-add .panel-body > .form-group > input[name="password"]').parent().append(
        $('body.users form.form-edit-add .panel-body > .form-group > input[name="password"]').parent().find('> small')
    );

    //---------------------------------------------------------------------------

});

// ---------------------------------------------------------------------------------------

$(document).ready(function () {

    // doors fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'doors', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'doors', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // users fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'users', fieldname: 'name',
                classes: ['col-md-6', 'col-sm-6', 'col-xs-12']
            },
            {
                page: 'users', fieldname: 'email',
                classes: ['col-md-6', 'col-sm-6', 'col-xs-12']
            },
            {
                page: 'users', fieldname: 'password',
                classes: ['col-md-6', 'col-sm-6', 'col-xs-12']
            },
            {
                page: 'users', fieldname: 'locale',
                classes: ['col-md-3', 'col-sm-3', 'col-xs-12']
            },
        ]
    );

    // windows fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'windows', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'windows', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // blinds fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'blinds', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'blinds', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // floors fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'floors', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'floors', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

     // ceilings fields width classes

     apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'ceilings', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'ceilings', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // electrical-mechanisms fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'electrical-mechanisms', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'electrical-mechanisms', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // labours fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'labours', fieldname: 'work_do',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'labours', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // sellers fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'sellers', fieldname: 'name',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'sellers', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // categories fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'categories', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'categories', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // types fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'types', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'types', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // colors types width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'colors', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'colors', fieldname: 'code',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'colors', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // openings fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'openings', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'openings', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // frame-materials fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'frame-materials', fieldname: 'name',
                classes: ['col-md-8', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'frame-materials', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // iva fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'iva', fieldname: 'type',
                classes: ['col-md-6', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'iva', fieldname: 'value',
                classes: ['col-md-6', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'iva', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // space-types fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'space-types', fieldname: 'name',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'space-types', fieldname: 'description',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            }
        ]
    );

    // roles fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'roles', fieldname: 'name',
                classes: ['col-md-6', 'col-sm-12', 'col-xs-12']
            },
            {
                page: 'roles', fieldname: 'display_name',
                classes: ['col-md-6', 'col-sm-12', 'col-xs-12']
            },
        ]
    );

    // configurations fields width classes

    apply_class_to_fields_if_are_not_configured_from_bread_admin(
        [
            {
                page: 'configurations', fieldname: 'current_value_html',
                classes: ['col-md-12', 'col-sm-12', 'col-xs-12']
            },
        ]
    );
});

// ---------------------------------------------------------------------------------------
