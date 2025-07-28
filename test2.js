/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], function(record, log) {
    
    function afterSubmit(context) {
        log.debug('After Submit Triggered');
    }

    return {
        afterSubmit: afterSubmit
    };
});
