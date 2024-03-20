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
        //console.log(response);
        const subCategoryField = formFields.value.find(field => field.databaseField === subCategoryDatabaseField);
        if (subCategoryField) {
          
          if (response.length === 0) {
           
            subCategoryField.options = [{ value: '', label: 'No Subcategory' }];
          } else {
           
                let options = [{ value: '', label: 'Select an option', disabled: true }];
                    
                response.forEach(item => {
                    options.push({ value: item.id, label: item[optionValue] });
                });
                subCategoryField.options = options;
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
 
  //useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKeyToUse
const fetchDataForSelect = async (useLabelNameToselectFormFieldToPopulate, endpoint, optionValue, formKey,defaultFormField=formFields.value,) => {
  try {
    const response = await apiService.get(endpoint);
    //console.log(response);
    const fieldObject = defaultFormField.find(f => f.label === useLabelNameToselectFormFieldToPopulate);
    if (fieldObject) {
      console.log(fieldObject)
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
