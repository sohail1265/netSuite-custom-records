/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record','N/currentRecord','N/log'], function (record) {
//  remove old lines form sublists
  function clearSublistLines(rec, sublistId) {
    var lineCount = rec.getLineCount({ sublistId: sublistId });
    for (var i = lineCount - 1; i >= 0; i--) {
      rec.removeLine({
        sublistId: sublistId,
        line: i,
        ignoreRecalc: true
      });
    }
  }

  function fieldChanged(context) {
    var currentRecord = context.currentRecord;
    var fieldId = context.fieldId;
    if (fieldId === 'custrecord_custominfo') {
      var customerId = currentRecord.getValue({
        fieldId: 'custrecord_custominfo',
      });
      log.debug('Field Changed:', fieldId);
      log.debug('Selected Customer ID:', customerId);

      try {
         // 1️⃣ First clear old data from all child subtabs
        clearSublistLines(currentRecord, 'recmachcustrecord_child_customer_notes'); // Education
        clearSublistLines(currentRecord, 'recmachcustrecord_child_perfessional_c'); // Professional Courses
        clearSublistLines(currentRecord, 'recmachcustrecord_child_ermrgancey');     // Emergency Contacts

        var customerRec = record.load({
          type: 'customrecord_custom_info',
          id: customerId
        });
        log.debug('Customer Record Loaded:', customerRec);
        // LINE COUNTS TO ALL SUBTABES HERE
        var lineCount1 = customerRec.getLineCount({
          sublistId:'recmachcustrecord_eq_customerinfo'
        });
          var lineCount2 = customerRec.getLineCount({
          sublistId:'recmachcustrecord_parent_pc'
        });
         var lineCount3 = customerRec.getLineCount({
          sublistId:'recmachcustrecord_emergency_contact_pc'
        });
        
        log.debug('line count education and qualification:', lineCount1);
        log.debug('line perfessional courses:', lineCount2);
        log.debug('line emergency contact:', lineCount3);

        // get and set education and qualification sublist data
        for (var i = 0; i < lineCount1; i++) {
        
          var subjectName = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_eq_customerinfo',
            fieldId: 'custrecord_subject_name',
            line: i
          });
          var obtainMarks = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_eq_customerinfo',
            fieldId: 'custrecord_obtain_marks',
            line: i
          });
          var totalMarks = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_eq_customerinfo', 
            fieldId: 'custrecord_total_marks',
            line: i
          });
          var cgpa = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_eq_customerinfo', 
            fieldId: 'custrecord_cgpa',
            line: i
          });
          var institeName = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_eq_customerinfo', 
            fieldId: 'custrecord__institute_name',
            line: i
          });
          log.debug('Subject Name:', subjectName);
          log.debug('Obtain Marks:', obtainMarks);
          log.debug('Total Marks:', totalMarks);
          log.debug('CGPA:', cgpa);
          log.debug('Institute Name:', institeName);
          // Set values in the sublist

          currentRecord.selectNewLine({
            sublistId: 'recmachcustrecord_child_customer_notes'
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_customer_notes',
            fieldId: 'custrecord_subject_name_c',
            value: subjectName
          });
            currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_customer_notes',
            fieldId: 'custrecord_obtain_marks_c',
            line: i,
            value: obtainMarks
          });
            currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_customer_notes',
            fieldId: 'custrecord_total_marks_c',
            line: i,
            value: totalMarks
          });
            currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_customer_notes',
            fieldId: 'custrecord_cgpa_c',
            value: cgpa
          });
            currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_customer_notes',
            fieldId: 'custrecord_institute_name_c',
            value: institeName
          });
          currentRecord.commitLine({
            sublistId: 'recmachcustrecord_child_customer_notes'
          });
  
        }
        // get and set perfessional courses subtabs data
    
        for(var j= 0; j< lineCount2; j++){
          // testing 
          console.log('line count check into loop for testing:', lineCount2)
          log.debug('line count into loop :', lineCount2)
          var subject1 = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_parent_pc',
            fieldId: 'custrecord_subject1',
            line: j
          });
           var subject2 = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_parent_pc',
            fieldId: 'custrecord_subject2',
            line: j
          });
           var subject3 = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_parent_pc',
            fieldId: 'custrecord_subject3',
            line: j
          });
           var subject4 = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_parent_pc',
            fieldId: 'custrecord_subject4',
            line: j
          });
          log.debug('Subject 1:', subject1);
          log.debug('Subject 2:', subject2);
          log.debug('Subject 3:', subject3);
          log.debug('Subject 4:', subject4);
        
          currentRecord.selectNewLine({
            sublistId: 'recmachcustrecord_child_perfessional_c'
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_perfessional_c',
            fieldId: 'custrecord_subject1_c',
            value: subject1
          });
           currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_perfessional_c',
            fieldId: 'custrecord_subject2_c',
            value: subject2
          });
           currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_perfessional_c',
            fieldId: 'custrecord_subject3_c',
            value: subject3
          });
           currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_child_perfessional_c',
            fieldId: 'custrecord_subject4_c',
            value: subject4
          });
          
          currentRecord.commitLine({
            sublistId: 'recmachcustrecord_child_perfessional_c'
          });

        }
        // get and set emergancey contact here
        for(var k=0; k < lineCount3; K++){
          var emerganceyName = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_emergency_contact_pc',
            fieldId: 'custrecord_emergency_name',
            line: k
          });
          var emerganceyPhone = customerRec.getSublistValue({
            sublistId: 'recmachcustrecord_emergency_contact_pc',
            fieldId: 'custrecord_emergency_phone',
            line: k
          });
          log.debug('emmergancey NAME#;', emerganceyName);
          log.debug('emergancey phone:', emerganceyPhone);

          currentRecord.selectNewLine({
            sublistId:'recmachcustrecord_child_ermrgancey'
          });
          currentRecord.setCurrentSublistValue({
            sublistId:'recmachcustrecord_child_ermrgancey',
            fieldId:'custrecord_emergency_phone_c',
            value: emerganceyName
          });
            currentRecord.setCurrentSublistValue({
            sublistId:'recmachcustrecord_child_ermrgancey',
            fieldId:'custrecord_emergency_name_c',
            value: emerganceyPhone
          });
          currentRecord.commitLine({
            sublistId:'recmachcustrecord_child_ermrgancey'
          });
        }
      } catch (e) {
        log.error('Error loading CustomerInfo:', e.message);
      }
    }
  }
  return {
    fieldChanged: fieldChanged
  };
});