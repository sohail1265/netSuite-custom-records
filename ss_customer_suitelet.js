/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define(['N/ui/serverWidget', 'N/search'], function (serverWidget, search) {

   function safeString(v) {
        if (v === null || v === undefined) return '';  
        if (Array.isArray(v)) return v.join(', ');
        // Dates/numbers/booleans will stringify fine
        return String(v);
    }
  
    function onRequest(context) {
        var form = serverWidget.createForm({
            title: 'Saved Search Viewer'
        });
       // Sublist
        var sublist = form.addSublist({
            id: 'custpage_resultlist',
            type: serverWidget.SublistType.LIST,
            label: 'Results'
        });
    
        // Load Saved Search
        var mySearch = search.load({
            id: 'customsearch_cust1_ss' 
        });
        log.debug('load my search:', mySearch);

       // Get search columns
        var columns = mySearch.columns;
       var fieldIds = [];

        // Dynamically add fields based on saved search columns
       for (var c = 0; c < columns.length; c++) {
            var col = columns[c];
            // Ensure a readable label
            var label = (col.label || col.name || ('Col ' + (c + 1))).toString();
            var fieldId = 'custpage_col_' + c;
            fieldIds.push(fieldId);

            sublist.addField({
                id: fieldId,
                type: serverWidget.FieldType.TEXT, // we render everything as text for simplicity
                label: label
            });
        }

              // Populate results
        var line = 0;
        mySearch.run().each(function (result) {
            for (var c = 0; c < columns.length; c++) {
                // Prefer the display text; fall back to the raw value
                var text = result.getText(columns[c]);
                var val  = result.getValue(columns[c]);
                var out  = safeString(text || val);

                // IMPORTANT: only set when non-empty to avoid "options.value" error
                if (out !== '') {
                    try {
                        sublist.setSublistValue({
                            id: fieldIds[c],
                            line: line,
                            value: out
                        });
                    } catch (e) {
                        // If anything odd happens on a particular column, log and continue
                        log.debug('Skip set value', {
                            line: line,
                            columnIndex: c,
                            columnLabel: columns[c].label || columns[c].name,
                            error: e.message
                        });
                    }
                } else {
                    // optional: log which fields were empty (comment out if too chatty)
                    // log.debug('Empty field skipped', { line: line, columnIndex: c });
                }
            }
            line++;
            return true; // continue
        });

        context.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});
