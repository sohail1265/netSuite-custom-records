/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/log'],
function(record, search, log) {

    function afterSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) return;

        var invoice = record.load({
            type: record.Type.INVOICE,
            id: context.newRecord.id,
            isDynamic: true
        });

        var lineCount = invoice.getLineCount({ sublistId: 'item' });
        log.debug('Invoice Loaded', 'ID: ' + context.newRecord.id + ', Lines: ' + lineCount);

        for (var i = 0; i < lineCount; i++) {
            invoice.selectLine({ sublistId: 'item', line: i });

            var itemId = invoice.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });
            var locationId = invoice.getValue({ fieldId: 'location' });
            var quantityToAssign = parseFloat(invoice.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' }));

            log.debug('Assigning Lots', 'Line ' + i + ', Item ID: ' + itemId + ', Location: ' + locationId + ', Need to assign: ' + quantityToAssign);

            var inventoryDetail = invoice.getCurrentSublistSubrecord({
                sublistId: 'item',
                fieldId: 'inventorydetail'
            });

            // Remove existing Lines
            var existingLines = inventoryDetail.getLineCount({ sublistId: 'inventoryassignment' });
            for (var x = existingLines - 1; x >= 0; x--) {
                inventoryDetail.removeLine({
                    sublistId: 'inventoryassignment',
                    line: x
                });
            }

            // Get available lots          
            var lots = getGroupedLotDetails(itemId, locationId);
            var remainingQty = quantityToAssign;

            for (var j = 0; j < lots.length && remainingQty > 0; j++) {
                var lot = lots[j];
                var assignQty = Math.min(parseFloat(lot.availableQty), remainingQty);

                inventoryDetail.selectNewLine({ sublistId: 'inventoryassignment' });

                // SETTING BY LOT NAME — NOT INTERNAL ID
              
                inventoryDetail.setCurrentSublistText({
                    sublistId: 'inventoryassignment',
                    fieldId: 'issueinventorynumber',
                    text: lot.lotInternalId
                });

                inventoryDetail.setCurrentSublistValue({
                    sublistId: 'inventoryassignment',
                    fieldId: 'quantity',
                    value: assignQty
                });

                inventoryDetail.commitLine({ sublistId: 'inventoryassignment' });

                remainingQty -= assignQty;

                log.debug('Assigned', 'Lot ID: ' + lot.lotInternalId + ', Qty: ' + assignQty + ' to line: ' + i);
            }

            if (remainingQty > 0) {
                log.error('Partial Assignment', 'Could not assign full qty for item ID: ' + itemId + '. Remaining: ' + remainingQty);
                throw new Error('Please configure the inventory detail for this line.');
            }

            invoice.commitLine({ sublistId: 'item' });
        }
        invoice.save({ ignoreMandatoryFields: true });
    }
    function getGroupedLotDetails(itemId, locationId) {
    var results = [];

    try {
        var lotSearch = search.load({ id: 'customsearch160' });
        log.debug('Saved Search Loaded', lotSearch);

        var filters = lotSearch.filters.slice(); // clone filters
        filters.push(search.createFilter({
            name: 'item',
            operator: search.Operator.ANYOF,
            values: [itemId]
        }));
        filters.push(search.createFilter({
            name: 'location',
            join: 'inventoryNumber',
            operator: search.Operator.ANYOF,
            values: [locationId]
        }));

        lotSearch.filters = filters;
        log.debug('Applied Filters', JSON.stringify(filters));

        var searchResult = lotSearch.run().getRange({ start: 0, end: 100 });
        log.debug('Search Results Count', searchResult.length);

        for (var i = 0; i < searchResult.length; i++) {
            var result = searchResult[i];

            var lotId = result.getValue({ name: 'inventorynumber', summary: 'GROUP', join: 'inventoryNumber' });
            var availableQty = result.getValue({ name: 'quantityonhand', summary: 'MAX', join: 'inventoryNumber' });
            var locText = result.getText({ name: 'location', summary: 'GROUP', join: 'inventoryNumber' });

            log.debug('Lot Result Row', 'LotID: ' + lotId + ', Qty: ' + availableQty + ', Location: ' + locText);

            results.push({
                lotInternalId: lotId,
                availableQty: availableQty
            });
        }

    } catch (err) {
        log.error('Saved Search Error', err.name + ': ' + err.message);
    }

    return results;
}


    return {
        afterSubmit: afterSubmit
    };
});