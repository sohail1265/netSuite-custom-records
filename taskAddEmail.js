/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(["N/record", "N/search"], (record, search) => {
  const fieldChanged = (context) => {
    const currentRecord = context.currentRecord;

    if (context.fieldId === "entity") {
      // 'entity' is the Customer field ID on invoice
      const customerId = currentRecord.getValue({ fieldId: "entity" });

      if (customerId) {
        try {
          // Lookup customer email
          const customerEmail = search.lookupFields({
            type: search.Type.CUSTOMER,
            id: customerId,
            columns: ["email"],
          }).email;
          log.debug(customerEmail);
          // Set email into Memo field
          currentRecord.setValue({
            fieldId: "memo",
            value: customerEmail || "",
          });
        } catch (error) {
          log.error("Error fetching customer email:", error);
        }
      }
    }
  };

  return {
    fieldChanged,
  };
});
