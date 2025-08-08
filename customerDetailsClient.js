/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/record"], function (record) {
  function fieldChanged(context) {
    var currentRecord = context.currentRecord;
    var fieldId = context.fieldId;
    if (fieldId === "add_new_customer") {
      var customerId = currentRecord.getValue({ fieldId: "add_new_customer" });
      log.debug("Field Changed:", fieldId);
      log.debug("Selected Customer ID:", customerId);

      if (!customerId) {
        // ❌ No customer selected — clear all fields
        currentRecord.setValue({ fieldId: 'custpage_phone', value: '' });
        currentRecord.setValue({ fieldId: 'custpage_email', value: '' });
        currentRecord.setValue({ fieldId: 'custpage_zip', value: '' });
        currentRecord.setValue({ fieldId: 'custpage_issuedate', value: '' });
        currentRecord.setValue({ fieldId: 'custpage_duedate', value: '' });
        return;
      }
        try {
          var customerRec = record.load({
            type: "customrecord_custom_info",
            id: customerId,
          });
          log.debug("Customer Record Loaded:", customerRec);
          var phone = customerRec.getValue({ fieldId: "custrecord_customer1" });
          var email = customerRec.getValue({ fieldId: "custrecord_customer2" });
          var zip = customerRec.getValue({ fieldId: "custrecord_customer3" });
          var issueDate = customerRec.getValue({ fieldId: "custrecord_issue" });
          var dueDate = customerRec.getValue({
            fieldId: "custrecord_customer_info_due_date",});
          console.log("Phone:", phone);
          console.log("Email:", email);
          console.log("Zip:", zip);
          console.log("Issue Date:", issueDate);
          console.log("Due Date:", dueDate);

          currentRecord.setValue({ fieldId: "custpage_phone", value: phone });
          currentRecord.setValue({ fieldId: "custpage_email", value: email });
          currentRecord.setValue({ fieldId: "custpage_zip", value: zip });
          currentRecord.setValue({
            fieldId: "custpage_issuedate",
            value: issueDate,
          });
          currentRecord.setValue({
            fieldId: "custpage_duedate",
            value: dueDate,
          });
          log.debug("Customer Info Loaded Successfully:" + currentRecord);
        } catch (e) {
          log.error("Error loading CustomerInfo:", e.message);
        }
      }
  }

  return {
    fieldChanged: fieldChanged,
  };
});
