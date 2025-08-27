/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], (record, log) => {

  const ORDER_TYPE_FIELD = 'custbody1';   // your Order Type field
  const DECISION_FIELD   = 'custbody2';   // your Accept/Reject field

  // Replace with the actual internal IDs from your list
  const ACCEPTED_ID = 1;  
  const REJECTED_ID = 2;  

  function afterSubmit(context) {
    try {
      const recId = context.newRecord.id;
      const recType = context.newRecord.type;

      // Reload the record so we can edit it
      const rec = record.load({
        type: recType,
        id: recId,
        isDynamic: false
      });

      const orderType = rec.getValue({ fieldId: ORDER_TYPE_FIELD });
      const status = rec.getValue({ fieldId: 'orderstatus' }); 
    

      log.debug('Order Type Value', orderType);
      log.debug('Status Value', status);

      let decision = null;

      if (orderType && status === 'B') {    
        decision = ACCEPTED_ID;
      } 
       else if (status === 'H' || (!orderType && status === 'B')) {
        decision = REJECTED_ID;
     }
       else {
        decision = null;
      }

      rec.setValue({
        fieldId: DECISION_FIELD,
        value: decision
      });

      rec.save({ enableSourcing: false, ignoreMandatoryFields: true });

    } catch (e) {
      log.error('Auto populate accept/reject failed', e);
    }
  }

  return { afterSubmit };
});
