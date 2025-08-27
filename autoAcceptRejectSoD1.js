/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/log'], (record, search, log) => {

  const ORDER_TYPE_FIELD = 'custbody1';   // your Order Type field
  const DECISION_FIELD   = 'custbody2';   // your Accept/Reject field

  const ACCEPTED_ID = 1;  
  const REJECTED_ID = 2;  

  function afterSubmit(context) {
    try {
      const recId = context.newRecord.id;

      // Only fetch the 2 fields we need
      const values = search.lookupFields({
        type: search.Type.SALES_ORDER,
        id: recId,
        columns: [ORDER_TYPE_FIELD, 'status']
      });
      log.debug('Values', values);

      // Parse order type
      const orderType = values[ORDER_TYPE_FIELD] && values[ORDER_TYPE_FIELD][0]
        ? values[ORDER_TYPE_FIELD][0].value
        : null;

      // Parse status
      const status = values.status && values.status[0]
        ? values.status[0].value
        : null;

      log.debug('Order Type Value', orderType);
      log.debug('Status Value', status);
      
      // Use real status values (not "B"/"H") b/h acctully status ids
      let decision = null;
      if (orderType && status === 'pendingFulfillment') {                 
        decision = ACCEPTED_ID;
      } else if (status === 'closed' || (!orderType && status === 'pendingFulfillment')) {  
        decision = REJECTED_ID;
      }

      // ✅ Update only if we have a decision
      if (decision !== null) {
        record.submitFields({
          type: record.Type.SALES_ORDER,
          id: recId,
          values: {
            [DECISION_FIELD]: decision
          },
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true
          }
        });
        log.debug('Decision Updated', decision);
      } else {
        log.debug('No decision applied, conditions not met');
      }

    } catch (e) {
      log.error('Auto populate accept/reject failed', e);
    }
  }

  return { afterSubmit };
});
