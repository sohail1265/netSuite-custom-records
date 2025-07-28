/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/log", "N/search"], function (
  serverWidget,
  log,
  search
) {
  function onRequest(context) {
    try {
      if (context.request.method === "GET") {
        var form = serverWidget.createForm({
          title: "Customer Details",
        });

        // 🔽 Add Customer Dropdown Field
        var customerField = form.addField({
          id: "add_new_customer",
          type: serverWidget.FieldType.SELECT,
          label: "Select Customer",
        });
        var customInfoSearch = search.create({
          type: "customrecord_custom_info", // your custom record ID
          filters: [["isinactive", "is", "F"]], //iski need nh hay
          columns: ["internalid"],
        });

        customInfoSearch.run().each(function (result) {
          var internalId = result.id; // this is the internal ID
          // var name = result.getValue('name'); // record name

          customerField.addSelectOption({
            value: internalId, // store internal ID
            text: " " + internalId + "", // show name + ID
          });
          return true;
        });

        // 📞 Phone Number Field
        form.addField({
          id: "custpage_phone",
          type: serverWidget.FieldType.PHONE,
          label: "Phone Number",
        });

        // 📧 Email Field
        form.addField({
          id: "custpage_email",
          type: serverWidget.FieldType.EMAIL,
          label: "Email",
        });

        // 🏷️ Zip Code
        form.addField({
          id: "custpage_zip",
          type: serverWidget.FieldType.TEXT,
          label: "Zip Code",
        });

        // 📅 Issue Date
        form.addField({
          id: "custpage_issuedate",
          type: serverWidget.FieldType.DATE,
          label: "Issue Date",
        });

        // 📅 Due Date
        form.addField({
          id: "custpage_duedate",
          type: serverWidget.FieldType.DATE,
          label: "Due Date",
        });

        // Submit button
        form.addSubmitButton({
          label: "Submit Details",
        });
        form.clientScriptModulePath = "./customerDetailsClient.js"; // adjust path
        log.debug(form.clientScriptModulePath);
        context.response.writePage(form);
      } else {
        // 📥 POST: Get values
        var customerId = context.request.parameters.add_new_customer;
        var phone = context.request.parameters.custpage_phone;
        var email = context.request.parameters.custpage_email;
        var zip = context.request.parameters.custpage_zip;
        var issueDate = context.request.parameters.custpage_issuedate;
        var dueDate = context.request.parameters.custpage_duedate;

        // 🧪 Debug log
        log.debug("Submitted Data", {
          customerId: customerId,
          customerName: customerName,
          phone: phone,
          email: email,
          zip: zip,
          issueDate: issueDate,
          dueDate: dueDate,
        });

        context.response.write(result);
      }
    } catch (e) {
      log.error({
        title: "Suitelet Error",
        details: e,
      });
      context.response.write("Error occurred: " + e.message);
    }
  }

  return {
    onRequest: onRequest,
  };
});
// form.clientScriptModulePath = 'SuiteScripts/customerDetailsClient.js'; // adjust path
