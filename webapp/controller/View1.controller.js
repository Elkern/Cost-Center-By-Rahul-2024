
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
   
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment,MessageBox) {
        "use strict";
        let that="";
        return Controller.extend("rahul.controller.View1", {
            onInit: function () {
                that = this;
            },
            onItemPress: function(oEvent) {
                let sProductId = oEvent.getSource().getBindingContext().getProperty("product_id");
                let InputValue1 = sProductId;
                let oRoute = sap.ui.core.UIComponent.getRouterFor(that);
                 oRoute.navTo("CostCenterReporting",{
                   obj_id : InputValue1
                 });
                 
            },
            onPressDelete:function(){

                //ALT 1
                //  that.getView().byId("stTable").getSelectedItems().map(function(oSelectedItem){
                //     that.getView().getModel().remove(oSelectedItem.getBindingContext().getPath());
                //     sap.m.MessageToast.show("Record deleted successfully");
                //  })

               //ALT 2 More appropriate for operations like delete
                  that.getView().byId("stTable").getSelectedItems().forEach(function(oSelectedItem){
                  that.getView().getModel().remove(oSelectedItem.getBindingContext().getPath());
                     })
                  sap.m.MessageToast.show("Record deleted successfully");
            },
            fnNumeric:function(oEvent){
             oEvent.getSource().setValue(oEvent.getSource().getValue().replace(/[^0-9]/g, ''));
            
            },
            fnChar: function(oEvent){
             oEvent.getSource().setValue(oEvent.getSource().getValue().replace(/[^a-zA-Z\s]]/g, ''));
            },
           
            onChagnefupl: function(oEvent){
                let filePath  = oEvent.getParameter("files")[0];  //It fetches parameters of files (Name,Size,Type)
                let contentReader = new FileReader();         //Inbuild class needed to read any file
                contentReader.onload = function(oEvent){   //File will load from oEvent with params here in this oEvent(1)
                    let data = oEvent.target.result;         //(3)This holds the binary data of the excel file
                    let workBook = XLSX.read(data,{             //This converts the binary in rows and coloumns(all columns one after another in single column)
                        type: 'binary'});
                    var excelData = XLSX.utils.sheet_to_row_object_array(workBook.Sheets[workBook.SheetNames[0]]);   //1 column all values get converted in rows and colomns
                    let flag = true   //flag is for messagebox to come one time only
                    for (var i = 0; i < excelData.length; i++) {
                                    that.getOwnerComponent().getModel().create("/Y24_C_TEST", excelData[i], {
                                        success: function(oData) {
                                            if(flag == true){
                                            MessageBox.success("Data Uploaded Successfully");
                                            }
                                            flag = false;
                                        },
                                        error: function(oError) {
                                            if(flag == true){
                                            MessageBox.error("Failed to upload data");
                                        }
                                        flag = false;
                                        }
                                    });
                                }
                            };
                            contentReader.readAsBinaryString(filePath);   //(2)
            },
            onExcelUpload:function(){
             
                    let contentReader = new FileReader();         //Inbuild class needed to read any file
                    contentReader.onload = function(oEvent){   //File will load from oEvent with params here in this oEvent(1)
                        let data = oEvent.target.result;         //(3)This holds the binary data of the excel file
                        let workBook = XLSX.read(data,{             //This converts the binary in rows and coloumns(all columns one after another in single column)
                            type: 'binary'});
                        var excelData = XLSX.utils.sheet_to_row_object_array(workBook.Sheets[workBook.SheetNames[0]]);   //1 column all values get converted in rows and colomns
                        let flag = true   //flag is for messagebox to come one time only
                        for (var i = 0; i < excelData.length; i++) {
                                        that.getOwnerComponent().getModel().create("/Y24_C_TEST", excelData[i], {
                                            success: function(oData) {
                                                if(flag == true){
                                                MessageBox.success("Data Uploaded Successfully");
                                                }
                                                flag = false;
                                            },
                                            error: function(oError) {
                                                if(flag == true){
                                                MessageBox.error("Failed to upload data");
                                            }
                                            flag = false;
                                            }
                                        });
                                    }
                                };
                                contentReader.readAsBinaryString(this.filePath);   //(2)
                    
            },

            onPressCreate: function () {
                // Load the fragment only if it hasn't been loaded yet
                if (!that._oDialog) {
                    Fragment.load({
                        id: that.getView().getId(),
                        name: "rahul.view.CostCenter", // Path to your fragment
                        controller: that
                    }).then(function (oFragment) {
                        that._oDialog = oFragment;
                        that.getView().addDependent(oFragment);
                        oFragment.open();
                    })
                } else {
                    that._oDialog.open();
                }
            },
            onCancelPress: function () {
                    that._oDialog.close();
                   // findAggregatedObjects() is a method available on UI5 controls that retrieves all the child controls (aggregated objects) that are part of the control instance.
                    var aInputs = that._oDialog.findAggregatedObjects("content"); // Get all content of the dialog
                    aInputs.forEach(function (oInput) {
                        if (oInput.setValue) { // Check if the control has setValue method
                            oInput.setValue(""); // Clear the input field
                        }
                    });

            },
            onSavePress: function(){
                let fragObj = {
                product_id : that.getView().byId("prodId").getValue(),
                product_nm : that.getView().byId("prodNm").getValue(),
                customer_nm : that.getView().byId("Cust_Nm").getValue(),
                cost_price :  that.getView().byId("Cost_Pr").getValue(),
                sales_price  : that.getView().byId("Sales_Pr").getValue()
                }
                that.getView().getModel().create("/Y24_C_TEST",fragObj,{
                    success: function(){
                        sap.m.MessageToast.show("Record created successfully");
                        that._oDialog.close();
                    }
                })
            }
        });
    });
      
