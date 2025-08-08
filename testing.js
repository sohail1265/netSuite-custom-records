/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/search"], function (search) {
  function fieldChanged(context) {
    var currentRecord = context.currentRecord;
    var fieldId = context.fieldId;

    // When user selects Customer Info
    if (fieldId === "custrecord_custominfo") {
      var customerInfoId = currentRecord.getValue({
        fieldId: "custrecord_custominfo",
      });
      log.debug("Field Changed:", fieldId);
      log.debug("Selected Customer Info ID:", customerInfoId);
      if (!customerInfoId) return;

      // Load related Education/Qualification records
      var educationSearch = search.create({
        type: "customrecord_education_qualification", // your sublist record type
        filters: [
          ["custrecord_eq_customerinfo", "is", customerInfoId], // link to parent
        ],
        columns: [
          "custrecord_subject_name",
          "custrecord_obtain_marks",
          "custrecord_total_marks",
          "custrecord_cgpa",
          "custrecord_institute_name",
        ],
      });

      // COUNT LINES
      var lineCount = currentRecord.getLineCount({
        sublistId: "recmachcustrecord_eq_customerinfo", // sublist ID (auto generated)
      });

      for (var i = lineCount - 1; i >= 0; i--) {
        currentRecord.removeLine({
          sublistId: "recmachcustrecord_eq_customerinfo",
          line: i,
        });
      }

      // Add each education record to sublist
      educationSearch.run().each(function (result) {
        currentRecord.selectNewLine({
          sublistId: "recmachcustrecord_eq_customerinfo",
        });

        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_eq_customerinfo",
          fieldId: "custrecord_education_name",
          value: result.getValue("custrecord_education_name"),
        });
        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_eq_customerinfo",
          fieldId: "custrecord_subject_name",
          value: result.getValue("custrecord_subject_name"),
        });
        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_eq_customerinfo",
          fieldId: "custrecord_obtain_marks",
          value: result.getValue("custrecord_obtain_marks"),
        });
        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_eq_customerinfo",
          fieldId: "custrecord_total_marks",
          value: result.getValue("custrecord_total_marks"),
        });
        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_eq_customerinfo",
          fieldId: "custrecord_cgpa",
          value: result.getValue("custrecord_cgpa"),
        });
        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_eq_customerinfo",
          fieldId: "custrecord_institute_name",
          value: result.getValue("custrecord_institute_name"),
        });

        currentRecord.commitLine({
          sublistId: "recmachcustrecord_eq_customerinfo",
        });

        return true;
      });
    }
  }

  return {
    fieldChanged: fieldChanged,
  };
});
