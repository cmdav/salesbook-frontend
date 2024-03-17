// useProductTable.js

import { ref } from 'vue';
import apiService from '@/services/apiService';


export function useSelectComposable(formFields, baseSubCategoriesUrl ="", categoryDatabaseField="", subCategoryDatabaseField="", optionValue="") {
  let isOptionLoadingMsg = ref(" ");

  //value is emitted from reusable form. it represented the selected category and database field
  const fetchDataForSubCategory = async (value, field_name) => {
  
    const currentUrl = `${baseSubCategoriesUrl}/${value}`;
   // console.log(currentUrl);
   //if (field_name === 'Category') {
  
    if (field_name === categoryDatabaseField) {
      
      isOptionLoadingMsg.value = "Please wait";
      try {
        const response = await apiService.get(currentUrl);
        //console.log(response);
        const subCategoryField = formFields.value.find(field => field.databaseField === subCategoryDatabaseField);
        if (subCategoryField) {
          
          if (response.length === 0) {
            // If response is empty, set options for "Sub Category" dropdown to include just "No Subcategory"
            subCategoryField.options = [{ value: '', label: 'No Subcategory' }];
          } else {
            // If response is not empty, map response data to options for "Sub Category" dropdown
            subCategoryField.options = [
                 { value: '', label: 'Select an option', disabled: true },
                 ...response.map(item => ({ value: item.id, label: item[optionValue] }))
             ]
          }
          isOptionLoadingMsg.value= "";
  
        } else {
  
          console.error("Sub Category field not found.");
          isOptionLoadingMsg.value= "Some went wrong. Try again";
  
        }
      } catch (error) {
  
        console.error('Error fetching data:', error);
        isOptionLoadingMsg.value= "Some went wrong. Try again";
      }
    }
  };
 
  
const fetchDataForSelect = async (useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKey) => {
  try {
    const response = await apiService.get(endpoint);
    //console.log(response);
    const fieldObject = formFields.value.find(f => f.label === useLabelNameToselectFormFieldToPopulate);
    if (fieldObject) {
      fieldObject.options = [
                                 { value: '', label: 'Select an option', disabled: true },
        ...response.map(item => ({ value: item[optionValue], label: item[formKey] }))
      ];

    } else {
      console.error(`Field with label not found.`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

  return {
    fetchDataForSelect,
    fetchDataForSubCategory,
    isOptionLoadingMsg
  
  };
}
