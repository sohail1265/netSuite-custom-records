/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search'], (ui, search) => {

    const SEARCH_ID = 'customsearch_eg_customer_save_search'; // change to your saved search internal ID

    const onRequest = (context) => {
        if (context.request.method === 'GET') {

            // Create a form
            let form = ui.createForm({ title: 'Customer Saved Search Results' });

            // Create a sublist
            let sublist = form.addSublist({
                id: 'custpage_sublist',
                type: ui.SublistType.LIST,
                label: 'Results'
            });

            // Define fixed columns (match your saved search columns)
            sublist.addField({ id: 'companyname', type: ui.FieldType.TEXT, label: 'Prospect Name' });
            sublist.addField({ id: 'emailpreference', type: ui.FieldType.TEXT, label: 'Email' });
            sublist.addField({ id: 'nsapiCT', type: ui.FieldType.TEXT, label: 'Phone' });
            sublist.addField({ id: 'entitystatus', type: ui.FieldType.TEXT, label: 'Prospect Status' });
            // sublist.addField({ id: 'lead', type: ui.FieldType.TEXT, label: 'Prospect Lead' });
            // sublist.addField({ id: 'item', type: ui.FieldType.TEXT, label: 'Item' });
            sublist.addField({ id: 'datecreated', type: ui.FieldType.TEXT, label: 'Date' });

            // Load the saved search
            let searchObj = search.load({ id: SEARCH_ID });

            // Run and set values in sublist
            let i = 0;
            searchObj.run().each(result => {
                sublist.setSublistValue({ id: 'companyname', line: i, value: result.getValue(searchObj.columns[0]) || '' });
                sublist.setSublistValue({ id: 'emailpreference', line: i, value: result.getValue(searchObj.columns[1]) || '' });
                sublist.setSublistValue({ id: 'nsapiCT', line: i, value: result.getValue(searchObj.columns[2]) || '' });
                sublist.setSublistValue({ id: 'entitystatus', line: i, value: result.getValue(searchObj.columns[3]) || '' });
                // sublist.setSublistValue({ id: 'lead', line: i, value: result.getValue(searchObj.columns[4]) || '' });
                // sublist.setSublistValue({ id: 'item', line: i, value: result.getValue(searchObj.columns[5]) || '' });
                sublist.setSublistValue({ id: 'datecreated', line: i, value: result.getValue(searchObj.columns[6]) || '' });
                i++;
                return true; // keep going
            });

            // Display the form
            context.response.writePage(form);
        }
    };

    return { onRequest };
});
