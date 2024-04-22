/**fetchdataforsubcategory is a function that populates another field e.g sub category when the category changes.
 * value is the id e.g baseSubCategoriesUrl /{value} will get all the sub category under the value
 * field_name is emitted from the child component. it is compared with categoryDatabaseField from the parent component
 * 
 * 
 * 
 */

import { ref } from 'vue';
import apiService from '@/services/apiService';


export function useSelectComposable(formFields, baseSubCategoriesUrl ="", categoryDatabaseField="", subCategoryDatabaseField="", optionValue="") {
    const isOptionLoadingMsg = ref("");
  
  //value is emitted from reusable form. it represented the selected category and database field
  const fetchDataForSubCategory = async (value, field_name, setSelectOption=null) => {
    //value=>id of the category to pull e.g 
    //field_name is the category field name .e g category_id

    const currentUrl = `${baseSubCategoriesUrl}/${value}`;
   
    //check to compare if the emit category is the same with that of the component
    if (field_name === categoryDatabaseField) {
      
      isOptionLoadingMsg.value = "Please wait";
      try {
        const response = await apiService.get(currentUrl);
       
        const subCategoryField = formFields.value.find(field => field.databaseField === subCategoryDatabaseField);
        // console.log(subCategoryField);
        // console.log(response);
        if (subCategoryField) {
          
          if (response.length === 0) {
           
            subCategoryField.options = [{ value: '', label: 'Nothing found' }];
          } else {
           
                let options = [{ value: '', label: 'Select an option', disabled: true }];
                  
                    if (Array.isArray(response)) {
                   
                      response.forEach(item => {
                          options.push({ value: item.id, label: item[optionValue] });
                      });
                      subCategoryField.options = options;
                     
                  } else if (response && response.id) {
                    // Handle single object response
                    options = [{ value: response.id, label: response[optionValue] }];
                    subCategoryField.options = options;
                    subCategoryField.value = response.id; // Set the value of the select to the id of the response
                  } else {
                    // Handle empty or invalid response
                    subCategoryField.options = [{ value: '', label: 'Nothing found' }];
                  }
                
                //set the value of the select to match the selected option
                if (setSelectOption != null) {
                    const matchingOption = options.find(option => option.label === setSelectOption);
                    if (matchingOption) {
                        subCategoryField.value = matchingOption.value;
                    }
                }
               
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
    console.log(isOptionLoadingMsg.value)
  };
 
  //useLabelNameToselectFormFieldToPopulate(product name), endpoint, optionValue(id for the option value), formKeyToUse(field that will be use to populate the label)
const fetchDataForSelect = async (useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKey,defaultFormField=formFields.value,) => {
  try {
    const response = await apiService.get(endpoint);
    console.log(response);
    const fieldObject = defaultFormField.find(f => f.label === useLabelNameToselectFormFieldToPopulate);
    if (fieldObject) {
     // console.log(fieldObject)
    //  console.log(response)
   
    //   console.log(optionValue)
    //   console.log(formKey)
      fieldObject.options = [
                                 { value: '', label: 'Select an option', disabled: true },
        ...response.map(item => ({ value: item[optionValue], label: item[formKey] }))
      ];

    } else {
     
      console.log(formFields.value)
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
