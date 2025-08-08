/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function afterSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) return;

        try {
            var invRec = record.load({
                type: record.Type.INVOICE,
                id: context.newRecord.id,
                isDynamic: true
            });
            var lineCount = invRec.getLineCount({ sublistId: 'item' });

            for (var i = 0; i < lineCount; i++) {
                invRec.selectLine({ sublistId: 'item', line: i });

                var itemId = invRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });
                var qty = parseFloat(invRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' }));
                var location = invRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'location' });

                if (!itemId || !qty || !location) {
                    log.debug("Skipping Line", "Missing itemId or qty or location on line: " + i);
                    invRec.commitLine({ sublistId: 'item' });
                    continue;
                }
                var inventoryDetail = invRec.getCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                });
                var remainingQty = qty;
                var lotResults = getGroupedLotDetails(itemId, location);

                if (!lotResults || lotResults.length === 0) {
                    log.debug("No Lots", "No lots available for item: " + itemId);
                    invRec.commitLine({ sublistId: 'item' });
                    continue;
                }

                for (var j = 0; j < lotResults.length && remainingQty > 0; j++) {
                    var lotNumberId = lotResults[j].lotInternalId;
                    var availableQty = parseFloat(lotResults[j].availableQty);

                    if (availableQty <= 0) continue;

                    var assignQty = Math.min(remainingQty, availableQty);

                    inventoryDetail.selectNewLine({ sublistId: 'inventoryassignment' });
                    inventoryDetail.setCurrentSublistValue({
                        sublistId: 'inventoryassignment',
                        fieldId: 'issueinventorynumber',
                        value: lotNumberId
                    });
                    inventoryDetail.setCurrentSublistValue({
                        sublistId: 'inventoryassignment',
                        fieldId: 'quantity',
                        value: assignQty
                    });
                    inventoryDetail.commitLine({ sublistId: 'inventoryassignment' });

                    remainingQty -= assignQty;
                }

                if (remainingQty > 0) {
                    log.error("Partial Assignment", 'Could not fulfill full qty for item: ' + itemId + '. Remaining: ' + remainingQty);
                }

                invRec.commitLine({ sublistId: 'item' });
            }

            invRec.save();
            log.debug("Invoice Updated", "Lot assignments completed successfully.");

        } catch (e) {
            log.error("Script Error", e.name + ' : ' + e.message);
        }
    }

    function getGroupedLotDetails(itemId, locationId) {
        var results = [];

        try {
            var mySearch = search.load({ id: 'customsearch_lot_available_qty' }); // replace with your actual saved search ID

            var filters = mySearch.filters;
            filters.push(['item', 'anyof', itemId]);
            filters.push('AND');
            filters.push(['inventorynumber.location', 'anyof', locationId]);

            mySearch.filters = filters;

            var searchResult = mySearch.run().getRange({ start: 0, end: 100 });

            searchResult.forEach(function(result) {
                var lotInternalId = result.getValue({ name: 'inventorynumber', summary: 'GROUP' });
                var lotQty = result.getValue({ name: 'quantityonhand', summary: 'MAX' });

                results.push({
                    lotInternalId: lotInternalId,
                    availableQty: lotQty
                });
            });

        } catch (err) {
            log.error("Saved Search Error", "Error while fetching lot details: " + err.name + ' - ' + err.message);
        }

        return results;
    }

    return {
        afterSubmit: afterSubmit
    };
});