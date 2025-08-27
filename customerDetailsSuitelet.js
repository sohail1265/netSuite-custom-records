/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define(['N/ui/serverWidget'], function (serverWidget) {

    function onRequest(context) {
        var form = serverWidget.createForm({
            title: 'Saved Search Viewer'
        });

        // (Optional) a filter at the top — not used yet
        form.addField({
            id: 'custpage_customer',
            type: serverWidget.FieldType.SELECT,
            label: 'Customer',
            source: 'customer'
        });

        // Results list — empty for now
        var sublist = form.addSublist({
            id: 'custpage_results',
            type: serverWidget.SublistType.LIST,
            label: 'Results'
        });

        // Define columns (headers only, no data yet)
        sublist.addField({
            id: 'custpage_col_tranid',
            type: serverWidget.FieldType.TEXT,
            label: 'Transaction #'
        });
        sublist.addField({
            id: 'custpage_col_trandate',
            type: serverWidget.FieldType.DATE,
            label: 'Date'
        });
        sublist.addField({
            id: 'custpage_col_type',
            type: serverWidget.FieldType.TEXT,
            label: 'Type'
        });
        sublist.addField({
            id: 'custpage_col_status',
            type: serverWidget.FieldType.TEXT,
            label: 'Status'
        });
        sublist.addField({
            id: 'custpage_col_amount',
            type: serverWidget.FieldType.CURRENCY,
            label: 'Amount'
        });

        // Just a submit button for future use
        form.addSubmitButton({ label: 'Search' });

        context.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});
