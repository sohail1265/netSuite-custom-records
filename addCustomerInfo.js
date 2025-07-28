/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/search'], function(record, search) {

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        var fieldId = context.fieldId;
    log.debug('Field Changed:', fieldId);


        // Trigger only when CustomerInfo field changes
        if (fieldId === 'custrecord_link_customerinfo') {
            var customerInfoId = currentRecord.getValue({ fieldId: 'custrecord_link_customerinfo' });
            
            if (customerInfoId) {
                // Load the CustomerInfo record
                var customerRecord = record.load({
                    type: 'customrecord_customerinfo', // your internal parent record ID
                    id: customerInfoId
                });

                // Get values from parent
                var phone = customerRecord.getValue({ fieldId: 'custrecord_customer1' });
                var email = customerRecord.getValue({ fieldId: 'custrecord_customer2' });
                var zip = customerRecord.getValue({ fieldId: 'custrecord_customer3' });
                var issueDate = customerRecord.getValue({ fieldId: 'custrecord_issue' });
                var dueDate = customerRecord.getValue({ fieldId: 'custrecord_customer_info_due_date' });

                // Set values in child record
                currentRecord.setValue({ fieldId: 'custrecordtest_phone_number', value: phone });
                currentRecord.setValue({ fieldId: 'custrecord_test_email', value: email });
                currentRecord.setValue({ fieldId: 'custrecordtest_zip', value: zip });
                currentRecord.setValue({ fieldId: 'custrecord_test_issue_date', value: issueDate });
                currentRecord.setValue({ fieldId: 'custrecord_test_due_date', value: dueDate });
            }
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});
