/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record'], function (ui, record) {

    function onRequest(context) {
        var request = context.request;
        var response = context.response;

        var form = ui.createForm({ title: 'Populate Customer Notes from CustomerInfo' });

        // Dropdown: Select CustomerInfo
        var customerInfoField = form.addField({
            id: 'custpage_customerinfo',
            type: ui.FieldType.SELECT,
            label: 'Customer Info',
            source: 'customrecord_customerinfo'
        });
        customerInfoField.isMandatory = true;

        // Check if a selection was made
        var selectedId = request.parameters.custpage_customerinfo;

        if (selectedId) {
            customerInfoField.defaultValue = selectedId;

            try {
                var parentRec = record.load({
                    type: 'customrecord_customerinfo',
                    id: selectedId
                });

                // Get values from parent
                var phone = parentRec.getValue('custrecord_customer1');  // Phone
                var email = parentRec.getValue('custrecord_customer2');  // Email
                var zip = parentRec.getValue('custrecord_customer3');    // Zip
                var issueDate = parentRec.getValue('custrecord_issue');  // Issue Date
                var dueDate = parentRec.getValue('custrecord_customer_info_due_date'); // Due Date

                // Add display fields
                var phoneField = form.addField({
                    id: 'custpage_phone',
                    type: ui.FieldType.TEXT,
                    label: 'Phone Number'
                });
                phoneField.defaultValue = phone || '';
                phoneField.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });

                var emailField = form.addField({
                    id: 'custpage_email',
                    type: ui.FieldType.EMAIL,
                    label: 'Email'
                });
                emailField.defaultValue = email || '';
                emailField.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });

                var zipField = form.addField({
                    id: 'custpage_zip',
                    type: ui.FieldType.TEXT,
                    label: 'Zip Code'
                });
                zipField.defaultValue = zip || '';
                zipField.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });

                var issueField = form.addField({
                    id: 'custpage_issue_date',
                    type: ui.FieldType.DATE,
                    label: 'Issue Date'
                });
                issueField.defaultValue = issueDate || '';
                issueField.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });

                var dueField = form.addField({
                    id: 'custpage_due_date',
                    type: ui.FieldType.DATE,
                    label: 'Due Date'
                });
                dueField.defaultValue = dueDate || '';
                dueField.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });

            } catch (e) {
                form.addField({
                    id: 'custpage_error',
                    type: ui.FieldType.INLINEHTML,
                    label: 'Error'
                }).defaultValue = '<div style="color:red;">Error loading record: ' + e.message + '</div>';
            }
        }

        // Submit to reload data
        form.addSubmitButton({ label: 'Load Customer Info' });

        response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});
