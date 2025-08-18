/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/log'], function(log) {

    function beforeLoad(context) {
        if (context.type === context.UserEventType.PRINT) {
            var rec = context.newRecord;

            // Step 1: Set value in-memory
         rec.setValue({
                fieldId: 'custentitycustentity_statement_note',
                value: 'This is your custom statement message.'
            });

            // Step 2: Immediately get value (from memory, not DB)
            var newValue = rec.getValue({
                fieldId: 'custentitycustentity_statement_note'
            });

            log.debug('Value after setting:', newValue);
        }
    }

    return { beforeLoad: beforeLoad };
});
